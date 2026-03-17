import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface DashboardMetrics {
  totalInventoryUnits: number;
  totalInventoryValue: number;
  totalSalesCount: number;
  totalSalesRevenue: number;
  totalDebtors: number;
  totalOutstandingDebt: number;
}

export function useAdminInspector(selectedUserId: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>({
    inventory: [],
    sales: [],
    debtors: [],
    transactions: [],
  });
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalInventoryUnits: 0,
    totalInventoryValue: 0,
    totalSalesCount: 0,
    totalSalesRevenue: 0,
    totalDebtors: 0,
    totalOutstandingDebt: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUserId) {
      setData({ inventory: [], sales: [], debtors: [], transactions: [] });
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const basePath = `users/${selectedUserId}`;
        
        // Parallel fetching across all 4 subcollections
        const [invSnap, salesSnap, debtorsSnap, transSnap] = await Promise.all([
          getDocs(query(collection(db, `${basePath}/inventory`), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, `${basePath}/sales`), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, `${basePath}/debtors`), orderBy("updatedAt", "desc"))),
          // Activity tab: fetch repayment logs across all debtors via a collectionGroup query
          // Falls back gracefully if empty
          getDocs(query(collection(db, `${basePath}/sales`), orderBy("createdAt", "desc"))).catch(() => null),
        ]);

        if (!isMounted) return;

        const inventory = invSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const sales = salesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const debtors = debtorsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Transactions tab = enriched sales with payment context (since there's no separate tx collection)
        const transactions = (transSnap?.docs || salesSnap.docs).map(d => ({
          id: d.id,
          ...d.data(),
        }));

        setData({ inventory, sales, debtors, transactions });

        // Calculate metrics using the correct Firestore field names
        let totalInventoryUnits = 0;
        let totalInventoryValue = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inventory.forEach((item: any) => {
          // Support both old (quantity/price) and new (stockLevel/sellingPrice) field names
          const qty = item.stockLevel ?? item.quantity ?? 0;
          const price = item.sellingPrice ?? item.price ?? 0;
          totalInventoryUnits += qty;
          totalInventoryValue += qty * price;
        });

        let totalSalesRevenue = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sales.forEach((sale: any) => {
          totalSalesRevenue += sale.totalAmount || 0;
        });

        let totalOutstandingDebt = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        debtors.forEach((debtor: any) => {
          totalOutstandingDebt += debtor.balanceOwed || 0;
        });

        setMetrics({
          totalInventoryUnits,
          totalInventoryValue,
          totalSalesCount: sales.length,
          totalSalesRevenue,
          totalDebtors: debtors.length,
          totalOutstandingDebt
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to inspect user data:", err);
        if (isMounted) setError(err.message || "Failed to load user data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllData();

    return () => { isMounted = false; };
  }, [selectedUserId]);

  return { ...data, metrics, isLoading, error };
}

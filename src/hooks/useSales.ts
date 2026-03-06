import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { Sale, NewSale } from "../types/sales";
import toast from "react-hot-toast";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSales([]);
      setIsLoading(false);
      return;
    }

    // Query all sales for this user from their specific subcollection.
    // Omit orderBy("createdAt") to prevent pending local cache documents from disappearing.
    const q = query(collection(db, `users/${user.uid}/sales`));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let salesData: Sale[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data({ serverTimestamps: "estimate" }),
            } as Sale)
        );

        // Sort manually by timestamp strictly descending
        salesData = salesData.sort((a, b) => {
          const timeA = (a.createdAt as Timestamp)?.toMillis
            ? (a.createdAt as Timestamp).toMillis()
            : 0;
          const timeB = (b.createdAt as Timestamp)?.toMillis
            ? (b.createdAt as Timestamp).toMillis()
            : 0;
          return timeB - timeA;
        });

        setSales(salesData);
        setIsLoading(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        console.error("Sales sync error:", err);
        if (err.code === "unavailable") {
          toast.error("Offline mode. Sales will sync when network returns.", {
            id: "offline-sales-toast",
          });
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const processSale = async (saleData: NewSale) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to process a sale");

      // We use a Firestore Write Batch to ensure the Sale triggers AND the stock deducts atomically.
      // If the offline cache accepts it, both happen instantly. If the connection fails mid-way,
      // Firebase queues the entire batch to retry later.
      const batch = writeBatch(db);

      // 1. Create the new Sale Document Reference inside the user's sales subcollection
      const newSaleRef = doc(collection(db, `users/${user.uid}/sales`));

      batch.set(newSaleRef, {
        ...saleData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // 2. Iterate through the Cart Items and queue stock deductions
      for (const item of saleData.items) {
        if (!item.productId) continue;
        const productRef = doc(
          db,
          `users/${user.uid}/inventory`,
          item.productId
        );

        // Atomically decrement the stock level by the exact quantity sold.
        // This is safe even offline via persistentLocalCache
        batch.update(productRef, {
          stockLevel: increment(-item.quantity),
        });
      }

      // 3. Commit the entire batch
      // We use fire-and-forget for instant optimistic UI responses
      batch.commit().catch((err) => {
        console.error("Sync error (process sale):", err);
      });

      toast.success("Sale processed successfully!");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error processing sale:", error);
      toast.error(error.message || "Failed to process sale");
      return { success: false, error: error.message };
    }
  };

  return {
    sales,
    isLoading,
    processSale,
  };
}

import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  serverTimestamp,
  writeBatch,
  increment,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { Debtor, NewDebtor, RepaymentLog } from "../types/debtors";
import toast from "react-hot-toast";

export function useDebtors() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch all Debtors in Real-time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDebtors([]);
      setIsLoading(false);
      return;
    }

    // Query debtors ordered by the most recently updated (e.g. recent sales or repayments)
    const q = query(
      collection(db, `users/${user.uid}/debtors`),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Only run sorting manually on the raw array if desired
        const debts = snapshot.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data({ serverTimestamps: "estimate" }),
            } as Debtor)
        );
        setDebtors(debts);
        setIsLoading(false);
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        console.error("Debtors sync error:", err);
        if (err.code === "unavailable") {
          toast.error("Offline mode. Debtors will sync when network returns.", {
            id: "offline-debtors-toast",
          });
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Add a new manual Debtor
  const addDebtor = async (debtorData: NewDebtor) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const batch = writeBatch(db);
      const newDebtorRef = doc(collection(db, `users/${user.uid}/debtors`));

      batch.set(newDebtorRef, {
        ...debtorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      toast.success("Customer profile created");
      return { success: true, id: newDebtorRef.id };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error adding debtor:", error);
      toast.error(error.message || "Failed to add customer");
      return { success: false, error: error.message };
    }
  };

  // 3. Log a Repayment (Complex Atomic Transaction)
  const logRepayment = async (
    debtorId: string,
    amount: number,
    method: "cash" | "transfer" | "pos"
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const batch = writeBatch(db);

      // A. Create the Repayment Log Document
      const repaymentRef = doc(
        collection(db, `users/${user.uid}/debtors/${debtorId}/repayments`)
      );
      const logData: RepaymentLog = {
        debtorId,
        amountCleared: amount,
        paymentMethod: method,
        createdAt: serverTimestamp(),
      };
      // We exclude `id` from being saved directly into the document payload
      batch.set(repaymentRef, logData);

      // B. Atomically decrement the main Debtor balance and update their timestamp
      const debtorRef = doc(db, `users/${user.uid}/debtors`, debtorId);
      batch.update(debtorRef, {
        balanceOwed: increment(-amount),
        updatedAt: serverTimestamp(),
      });

      // Commit the batch fire-and-forget for instant UI
      batch.commit().catch((err) => {
        console.error("Sync error (repayment):", err);
      });

      toast.success(`₦${amount.toLocaleString()} repayment logged!`);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error logging repayment:", error);
      toast.error(error.message || "Failed to log repayment");
      return { success: false, error: error.message };
    }
  };

  // 4. Edit an existing Debtor
  const editDebtor = async (debtorId: string, updates: Partial<Debtor>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const debtorRef = doc(db, `users/${user.uid}/debtors`, debtorId);
      
      const payload = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      const batch = writeBatch(db);
      batch.update(debtorRef, payload);
      await batch.commit();

      toast.success("Customer profile updated");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error updating debtor:", error);
      toast.error(error.message || "Failed to update customer");
      return { success: false, error: error.message };
    }
  };

  return {
    debtors,
    isLoading,
    addDebtor,
    editDebtor,
    logRepayment,
  };
}

// 4. Hook to strictly map the Repayments subcollection timeline
export function useRepaymentHistory(debtorId: string | undefined) {
  const [repayments, setRepayments] = useState<RepaymentLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !debtorId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRepayments([]);
      return;
    }

    setIsLoadingHistory(true);
    const q = query(
      collection(db, `users/${user.uid}/debtors/${debtorId}/repayments`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map(
          (docSnap) =>
            ({
              id: docSnap.id,
              ...docSnap.data({ serverTimestamps: "estimate" }),
            } as RepaymentLog)
        );
        setRepayments(logs);
        setIsLoadingHistory(false);
      },
      (err) => {
        console.error("Repayment history sync error:", err);
        setIsLoadingHistory(false);
      }
    );

    return () => unsubscribe();
  }, [debtorId]);

  return { repayments, isLoadingHistory };
}

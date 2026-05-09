import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { Expense, NewExpense } from "../types/expenses";
import toast from "react-hot-toast";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/expenses`));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let expenseData: Expense[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data({ serverTimestamps: "estimate" }),
            } as Expense)
        );

        // Sort manually by date and then by creation timestamp descending
        expenseData = expenseData.sort((a, b) => {
          if (a.date !== b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          const timeA = (a.createdAt as Timestamp)?.toMillis ? (a.createdAt as Timestamp).toMillis() : 0;
          const timeB = (b.createdAt as Timestamp)?.toMillis ? (b.createdAt as Timestamp).toMillis() : 0;
          return timeB - timeA;
        });

        setExpenses(expenseData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Expenses sync error:", err);
        if (err.code === "unavailable") {
          toast.error("Offline mode. Expenses will sync when network returns.");
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addExpense = async (expenseData: NewExpense) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to add an expense");

      const newExpenseRef = doc(collection(db, `users/${user.uid}/expenses`));
      
      // Fire-and-forget for instant optimistic UI
      setDoc(newExpenseRef, {
        ...expenseData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      }).catch((err) => {
        console.error("Error saving expense to cloud:", err);
      });

      toast.success("Expense recorded successfully");
      return { success: true };
    } catch (err: any) {
      console.error("Error processing expense:", err);
      toast.error(err.message || "Failed to record expense");
      return { success: false, error: err.message };
    }
  };

  const updateExpense = async (expenseId: string, updatedData: Partial<NewExpense>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to update an expense");

      const expenseRef = doc(db, `users/${user.uid}/expenses`, expenseId);
      
      // Fire-and-forget for instant optimistic UI
      setDoc(expenseRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      }, { merge: true }).catch((err) => {
        console.error("Error updating expense in cloud:", err);
      });

      toast.success("Expense updated successfully");
      return { success: true };
    } catch (err: any) {
      console.error("Error updating expense:", err);
      toast.error(err.message || "Failed to update expense");
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to delete an expense");

      const expenseRef = doc(db, `users/${user.uid}/expenses`, expenseId);
      
      // Fire-and-forget
      deleteDoc(expenseRef).catch((err) => {
        console.error("Error deleting expense from cloud:", err);
      });

      toast.success("Expense deleted");
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      toast.error(err.message || "Failed to delete expense");
      return { success: false, error: err.message };
    }
  };

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

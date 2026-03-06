import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { Product, NewProduct } from "../types/inventory";
import toast from "react-hot-toast";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    // Query all products for this user.
    // We intentionally omit orderBy("createdAt") here because pending serverTimestamps
    // drop off local snapshots causing the UI to not update instantly. We sort in memory instead.
    const q = query(collection(db, `users/${user.uid}/inventory`));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // this fires instantly from cache even if offline.
        // We use serverTimestamps: 'estimate' so locally added docs have a predictive timestamp to sort by
        let inventoryData: Product[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data({ serverTimestamps: "estimate" }),
            } as Product)
        );

        // Sort manually by timestamp strictly descending
        inventoryData = inventoryData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setProducts(inventoryData);
        setIsLoading(false);

        if (snapshot.metadata.fromCache && inventoryData.length > 0) {
          // Intentionally left empty for future offline indicator logic
        }
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        console.error("Inventory sync error:", err);
        // Only show offline toast if it's an actual network failure (error code usually strictly "unavailable")
        if (err.code === "unavailable") {
          toast.error("Offline mode. Changes will sync when network returns.", {
            id: "offline-toast",
          });
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: NewProduct) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      // Fire-and-forget so offline users get an instant success feedback.
      // Firebase persistentLocalCache automatically queues this to sync with the server later.
      addDoc(collection(db, `users/${user.uid}/inventory`), {
        ...productData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      }).catch((err) => console.error("Sync error (add product):", err));

      toast.success("Product added successfully!");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const docRef = doc(db, `users/${user.uid}/inventory`, id);

      updateDoc(docRef, updates).catch((err) =>
        console.error("Sync error (update product):", err)
      );

      toast.success("Product updated successfully!");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const docRef = doc(db, `users/${user.uid}/inventory`, id);

      deleteDoc(docRef).catch((err) =>
        console.error("Sync error (delete product):", err)
      );

      toast.success("Product deleted successfully!");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

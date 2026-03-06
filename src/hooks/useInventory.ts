import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
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

    // Query all products for this user, ordered by newest first
    const q = query(
      collection(db, "inventory"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Because we enabled persistentLocalCache in firebase.ts,
        // this fires instantly from cache even if offline.
        const inventoryData: Product[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        );

        setProducts(inventoryData);
        setIsLoading(false);

        // Optional: We can check if data came from cache to notify the user
        if (snapshot.metadata.fromCache && inventoryData.length > 0) {
          // We only notify if it's explicitly a disconnect, but snapshot usually handles it seamlessly
        }
      },
      (err) => {
        console.error("Inventory sync error:", err);
        toast.error("Offline mode. Changes will sync when network returns.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: NewProduct) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in");

      const docPromise = addDoc(collection(db, "inventory"), {
        ...productData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.promise(docPromise, {
        loading: "Adding product...",
        success: "Product added successfully!",
        error: "Failed to add product.",
      });

      await docPromise;
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const docRef = doc(db, "inventory", id);
      const updatePromise = updateDoc(docRef, updates);

      toast.promise(updatePromise, {
        loading: "Updating product...",
        success: "Product updated successfully!",
        error: "Failed to update product.",
      });

      await updatePromise;
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, "inventory", id);
      const deletePromise = deleteDoc(docRef);

      toast.promise(deletePromise, {
        loading: "Deleting product...",
        success: "Product deleted!",
        error: "Failed to delete product.",
      });

      await deletePromise;
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

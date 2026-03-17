import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import type { StoreSettings, UpdateSettingsPayload } from "../types/settings";
import toast from "react-hot-toast";

const DEFAULT_SETTINGS: StoreSettings = {
  businessName: "My Store",
  currencySymbol: "₦",
  lowStockThreshold: 5,
  updatedAt: serverTimestamp(),
};

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Real-time Settings
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoading(false);
      return;
    }

    const settingsRef = doc(db, `users/${user.uid}/settings/preferences`);

    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({
            id: docSnap.id,
            ...(docSnap.data() as Omit<StoreSettings, "id">),
          });
        } else {
          // Initialize default settings on first load if none exist
          setDoc(settingsRef, DEFAULT_SETTINGS).catch((err) =>
            console.error("Failed to initialize default settings:", err)
          );
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Settings sync error:", err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Update Settings
  const updateSettings = async (payload: UpdateSettingsPayload) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be logged in to update settings.");

      const settingsRef = doc(db, `users/${user.uid}/settings/preferences`);
      
      await setDoc(
        settingsRef,
        {
          ...payload,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Settings saved successfully");
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error updating settings:", error);
      toast.error(error.message || "Failed to save settings");
      return { success: false, error: error.message };
    }
  };

  return { settings, isLoading, updateSettings };
}

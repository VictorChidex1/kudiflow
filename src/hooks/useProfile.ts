import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import toast from "react-hot-toast";

export interface UserProfile {
  fullName: string;
  shopName: string;
  phone: string;
  email: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user details
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setProfile(userSnap.data() as UserProfile);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update profile endpoint
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updates);
      
      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      toast.success("Profile updated successfully!");
      return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Profile Update Error:", err);
      toast.error(err.message || "Failed to update profile");
      return { success: false, error: err.message };
    }
  };

  return { profile, isLoading, updateProfile };
}

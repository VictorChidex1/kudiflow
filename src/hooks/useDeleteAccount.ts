import { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SUBCOLLECTIONS = ["inventory", "sales", "debtors", "settings", "transactions"];

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  /**
   * Re-authenticates the current user before destructive operations.
   * Firebase requires recent authentication to delete an account.
   * @param password - Pass the user's password for email/password accounts.
   *                   Leave empty for Google accounts (triggers Google popup).
   */
  const reauthenticate = async (password?: string): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const provider = user.providerData[0]?.providerId;

      if (provider === "google.com") {
        // Google users re-authenticate via Google popup
        const googleProvider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, googleProvider);
      } else {
        // Email/password users re-authenticate with their password
        if (!password) {
          toast.error("Please enter your password to confirm deletion.");
          return false;
        }
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
      }
      return true;
    } catch (err: unknown) {
      const error = err as Error & { code?: string };
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Account deletion cancelled.");
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.error("Re-authentication cancelled.");
      } else {
        toast.error("Re-authentication failed. Please try again.");
      }
      return false;
    }
  };

  /**
   * Deletes all user subcollections from Firestore in batched writes.
   */
  const deleteUserData = async (userId: string) => {
    const batch = writeBatch(db);
    let operationCount = 0;

    for (const subcollection of SUBCOLLECTIONS) {
      const colRef = collection(db, `users/${userId}/${subcollection}`);
      const snap = await getDocs(colRef);
      snap.docs.forEach((document) => {
        batch.delete(document.ref);
        operationCount++;
      });
    }

    // Delete parent user document
    batch.delete(doc(db, "users", userId));
    operationCount++;

    if (operationCount > 0) await batch.commit();
  };

  /**
   * Main account deletion function.
   * @param password - Required for email/password accounts, optional for Google.
   */
  const deleteAccount = async (password?: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("No user session found. Please log in again.");
      return;
    }

    setIsDeleting(true);

    try {
      // Step 1: Re-authenticate (required by Firebase before deleteUser)
      const reauthed = await reauthenticate(password);
      if (!reauthed) {
        setIsDeleting(false);
        return;
      }

      // Step 2: Delete all Firestore data
      await deleteUserData(user.uid);

      // Step 3: Delete the Firebase Auth account itself
      await deleteUser(user);

      toast.success("Your account has been permanently deleted.");
      navigate("/");
    } catch (err: unknown) {
      const error = err as Error & { code?: string };
      console.error("Account deletion error:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Session expired. Please log out, log back in, and try again.");
      } else {
        toast.error(error.message || "Failed to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting };
}

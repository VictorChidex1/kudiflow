import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import toast from "react-hot-toast";

export function useDataWipe() {
  const wipeCollection = async (collectionPath: string, label: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Must be authenticated");

      // We explicitly query the subcollection belonging to the user
      const fullPath = `users/${user.uid}/${collectionPath}`;
      const querySnapshot = await getDocs(collection(db, fullPath));
      
      if (querySnapshot.empty) {
        toast(`${label} is already empty.`, { icon: "ℹ️" });
        return { success: true };
      }

      // Firestore batches can handle up to 500 writes. We chunk it.
      const batches = [];
      let currentBatch = writeBatch(db);
      let operationCount = 0;

      querySnapshot.forEach((document) => {
        currentBatch.delete(document.ref);
        operationCount++;

        if (operationCount === 490) {
          batches.push(currentBatch.commit());
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      });

      if (operationCount > 0) {
        batches.push(currentBatch.commit());
      }

      await Promise.all(batches);
      toast.success(`${label} wiped successfully!`);
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Wipe failed for ${label}:`, error);
      toast.error(`God-Mode wiped failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const wipeInventory = () => wipeCollection("inventory", "Inventory");
  const wipeSales = () => wipeCollection("sales", "Sales History");
  const wipeDebtors = async () => {
    // Need to wipe debtors, but they also have a 'repayments' nested subcollection
    // which normally requires cloud functions or recursive deletes.
    // For now, flattening the main debtors collection is sufficient for V1.
    return wipeCollection("debtors", "Debtors Ledger");
  };

  return { wipeInventory, wipeSales, wipeDebtors };
}

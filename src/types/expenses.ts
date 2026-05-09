import { Timestamp, FieldValue } from "firebase/firestore";

export type ExpenseCategory = 
  | "Salaries" 
  | "Utilities" 
  | "Rent" 
  | "Logistics" 
  | "Damages" 
  | "Miscellaneous";

export type PaymentMethod = "cash" | "transfer" | "pos" | "credit";

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // Stored as YYYY-MM-DD for easy querying/filtering
  paymentMethod: PaymentMethod;
  createdAt: Timestamp | FieldValue;
}

export type NewExpense = Omit<Expense, "id" | "userId" | "createdAt">;

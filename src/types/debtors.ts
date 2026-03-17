import { Timestamp, FieldValue } from "firebase/firestore";

export interface RepaymentLog {
  id?: string;
  debtorId: string;
  amountCleared: number;
  paymentMethod: "cash" | "transfer" | "pos";
  createdAt: Timestamp | FieldValue;
}

export interface Debtor {
  id?: string;
  name: string;
  phone: string;
  balanceOwed: number;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  repayments?: RepaymentLog[]; // Only populated locally when viewing a specific debtor
}

export type NewDebtor = Omit<
  Debtor,
  "id" | "createdAt" | "updatedAt" | "repayments"
>;

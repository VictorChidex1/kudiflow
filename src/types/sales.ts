import { Timestamp, FieldValue } from "firebase/firestore";

export type PaymentMethod = "cash" | "transfer" | "pos" | "credit";
export type PaymentStatus = "paid" | "partial" | "unpaid";

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName?: string;
  customerPhone?: string;
  createdAt: Timestamp | FieldValue; // Supports both serverTimestamp and local Date fallbacks
}

export type NewSale = Omit<Sale, "id" | "userId" | "createdAt">;

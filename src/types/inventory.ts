import { Timestamp } from "firebase/firestore";

export interface Product {
  id?: string;
  userId: string;
  productName: string;
  sellingPrice: number;
  costPrice: number;
  stockLevel: number;
  createdAt?: Timestamp;
}

export type NewProduct = Omit<Product, "id" | "createdAt" | "userId">;

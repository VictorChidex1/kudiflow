import { Timestamp } from "firebase/firestore";

export interface Product {
  id?: string;
  userId: string;
  productName: string;
  category?: string;
  sku?: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  stockLevel: number;
  minStockLevel: number;
  unit: string;
  expiryDate?: string; // Storing as YYYY-MM-DD string for easy form binding
  notes?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
}

export type NewProduct = Omit<Product, "id" | "createdAt" | "userId">;

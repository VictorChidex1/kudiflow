import { FieldValue, Timestamp } from "firebase/firestore";

export interface StoreSettings {
  id?: string;
  businessName: string;
  currencySymbol: "₦" | "$" | "£" | "€";
  lowStockThreshold: number;
  updatedAt: FieldValue | Timestamp;
}

export type UpdateSettingsPayload = Partial<Omit<StoreSettings, "id" | "updatedAt">>;

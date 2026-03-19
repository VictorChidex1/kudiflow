import { Timestamp } from "firebase/firestore";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;           // e.g. "how-to-manage-debtors" - used for the URL
  excerpt: string;        // 1-2 sentences for the preview card
  content: string;        // Markdown content of the full article
  coverImage: string;     // URL to the hero image
  status: "draft" | "published";
  author: string;         // The display name of the writer
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { BlogPost } from "../types/blog";
import toast from "react-hot-toast";

// Fetch ALL posts (Drafts & Published) for the Super Admin CMS
export function useAllBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "blogs"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData: BlogPost[] = [];
        snapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setPosts(postsData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching all blog posts:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { posts, isLoading, error };
}

// Fetch ONLY Published posts for the Public Website
export function usePublishedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "blogs"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData: BlogPost[] = [];
        snapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        setPosts(postsData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching published blog posts:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { posts, isLoading, error };
}

// Fetch a single public post by its URL Slug
export function useBlogPostBySlug(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "blogs"),
      where("slug", "==", slug),
      where("status", "==", "published")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as BlogPost);
        } else {
          setPost(null);
          setError("Post not found");
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching post by slug:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [slug]);

  return { post, isLoading, error };
}

// Editor Action Hook for creating, updating, and deleting
export function useBlogEditor() {
  const [isSaving, setIsSaving] = useState(false);

  const createPost = async (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, "blogs"), {
        ...data,
        // publishedAt comes from data (set by the editor). If not set and publishing, default to now.
        publishedAt: data.publishedAt ?? (data.status === "published" ? serverTimestamp() : null),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Blog post created!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePost = async (id: string, data: Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>) => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "blogs", id);
      // If being published for the first time and no publishedAt set, stamp it now.
      const updatePayload = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      if (data.status === "published" && data.publishedAt === undefined) {
        (updatePayload as Record<string, unknown>).publishedAt = serverTimestamp();
      }
      await updateDoc(docRef, updatePayload);
      toast.success("Blog post updated!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    // We add an extra confirmation here just in case, though the UI should also confirm
    if (!window.confirm("Are you incredibly sure you want to delete this post instantly? This cannot be undone.")) {
      return;
    }
    
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Blog post permanently deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    createPost,
    updatePost,
    deletePost,
    isSaving,
  };
}

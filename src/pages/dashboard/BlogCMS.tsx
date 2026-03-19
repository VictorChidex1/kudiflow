import { useState } from "react";
import { useAllBlogPosts } from "../../hooks/useBlogPosts";
import type { BlogPost } from "../../types/blog";
import { BlogListManager } from "../../components/dashboard/BlogListManager";
import { BlogEditor } from "../../components/dashboard/BlogEditor";

export default function BlogCMS() {
  const { posts, isLoading, error } = useAllBlogPosts();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const startNewPost = () => {
    setActivePost(null);
    setIsEditing(true);
  };

  const editExistingPost = (post: BlogPost) => {
    setActivePost(post);
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setActivePost(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dynamic View Injection */}
      {!isEditing ? (
        <BlogListManager 
          posts={posts}
          isLoading={isLoading}
          error={error}
          onCreateNew={startNewPost}
          onEdit={editExistingPost}
        />
      ) : (
        <BlogEditor 
          initialPost={activePost}
          onCancel={closeEditor}
          onSaveComplete={closeEditor}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import type { BlogPost } from "../../types/blog";
import { useBlogEditor } from "../../hooks/useBlogPosts";
import { auth, storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Layout, Eye, Save, Send, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface BlogEditorProps {
  initialPost?: BlogPost | null;
  onCancel: () => void;
  onSaveComplete: () => void;
}

export function BlogEditor({ initialPost, onCancel, onSaveComplete }: BlogEditorProps) {
  const { createPost, updatePost, isSaving } = useBlogEditor();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [status] = useState<"draft" | "published">(initialPost?.status || "draft");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dirtySlug, setDirtySlug] = useState(!!initialPost?.slug); // Check if user manually touched slug
  const [dirtyExcerpt, setDirtyExcerpt] = useState(!!initialPost?.excerpt);

  // Mobile responsiveness
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Auto-generate slug continuously UNLESS user manually typed one
  useEffect(() => {
    if (!dirtySlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [title, dirtySlug]);

  // Auto-generate excerpt continuously from content UNLESS user manually typed one
  useEffect(() => {
    if (!dirtyExcerpt && content.length > 0) {
      const plainText = content.replace(/[#*`_~\[\]]/g, '').replace(/\n/g, ' ').slice(0, 150).trim();
      setExcerpt(plainText + (content.length > 150 ? '...' : ''));
    }
  }, [content, dirtyExcerpt]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploadingImage(true);
    const storageRef = ref(storage, `blogs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error", error);
        toast.error("Failed to upload image.");
        setIsUploadingImage(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setCoverImage(downloadURL);
        toast.success("Image uploaded!");
        setIsUploadingImage(false);
      }
    );
  };

  const handleSave = async (forceStatus?: "draft" | "published") => {
    const finalStatus = forceStatus || status;
    const postData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      status: finalStatus,
      author: auth.currentUser?.displayName || "Admin User",
    };

    try {
      if (initialPost?.id) {
        await updatePost(initialPost.id, postData);
      } else {
        await createPost(postData);
      }
      onSaveComplete();
    } catch (err) {
      // Error is handled in the hook via toast
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up flex flex-col h-[85vh]">
      {/* Top Action Bar */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
            {initialPost ? "Edit Post" : "New Post"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Tab Toggle */}
          <div className="flex sm:hidden mr-2 bg-slate-200/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "write" ? "bg-white shadow text-slate-900" : "text-slate-500"
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === "preview" ? "bg-white shadow text-slate-900" : "text-slate-500"
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving || !title || !content}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-kudi-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving || !title || !content}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-kudi-green hover:bg-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {initialPost?.status === "published" ? "Update Live" : "Publish Now"}
          </button>
        </div>
      </div>

      {/* Editor Split Pane */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-slate-50 lg:divide-x divide-slate-200">
        
        {/* Left Pane: Writer Inputs */}
        <div 
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 ${
            activeTab === "write" ? "flex" : "hidden sm:flex"
          }`}
        >
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="How to Manage Debtors Effectively"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  setDirtySlug(true);
                }}
                placeholder="manage-debtors-effectively"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image</label>
              <div className="flex bg-white border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-kudi-green focus-within:border-transparent transition-shadow overflow-hidden">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste URL or upload..."
                  className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-slate-600"
                />
                <label className="flex items-center justify-center px-4 border-l border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-slate-600 text-sm font-medium">
                  {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                  <span className="ml-2 hidden sm:block">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Excerpt (SEO Preview)</label>
              <textarea
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setDirtyExcerpt(true);
                }}
                rows={2}
                placeholder="A quick 1-2 sentence summary of this article..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow text-slate-600 resize-none"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col mt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
              <Layout className="w-4 h-4 text-emerald-600" />
              Markdown Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your masterpiece using Markdown (*italic*, **bold**, # headings)..."
              className="flex-1 w-full min-h-[400px] p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow font-mono text-sm leading-relaxed text-slate-800 resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div 
          className={`flex-1 overflow-y-auto bg-white p-4 sm:p-8 lg:p-12 ${
            activeTab === "preview" ? "block" : "hidden sm:block"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
            <Eye className="w-4 h-4" />
            Live Preview
          </div>

          {/* Render the actual Title & Image for realism */}
          {coverImage && (
            <img 
              src={coverImage} 
              alt="Cover" 
              className="w-full h-48 md:h-64 object-cover rounded-2xl mb-8 shadow-sm"
            />
          )}

          {title && (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              {title}
            </h1>
          )}

          {/* The Markdown Parser wrapped in Tailwind Typography */}
          <article className="prose prose-slate prose-emerald max-w-none hover:prose-a:text-emerald-600">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic">No content written yet...</p>
            )}
          </article>
        </div>

      </div>
    </div>
  );
}

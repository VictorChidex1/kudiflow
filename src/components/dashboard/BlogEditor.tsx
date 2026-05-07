import { useState, useEffect, useCallback } from "react";
import type { BlogPost } from "../../types/blog";
import { useBlogEditor } from "../../hooks/useBlogPosts";
import { auth, storage } from "../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Eye,
  Save,
  Send,
  ArrowLeft,
  ImagePlus,
  Loader2,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Minus,
  RotateCcw,
  RotateCw,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

interface BlogEditorProps {
  initialPost?: BlogPost | null;
  onCancel: () => void;
  onSaveComplete: () => void;
}

// Helper: Convert a Firebase Timestamp or Date to a datetime-local string
function toDatetimeLocal(value: Timestamp | Date | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Timestamp ? value.toDate() : new Date(value as Date);
  // datetime-local format: YYYY-MM-DDTHH:MM
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BlogEditor({ initialPost, onCancel, onSaveComplete }: BlogEditorProps) {
  const { createPost, updatePost, isSaving } = useBlogEditor();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [status] = useState<"draft" | "published">(initialPost?.status || "draft");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dirtySlug, setDirtySlug] = useState(!!initialPost?.slug);
  const [dirtyExcerpt, setDirtyExcerpt] = useState(!!initialPost?.excerpt);

  // Publish date for backdating (defaults to now for new posts)
  const [publishedAt, setPublishedAt] = useState<string>(
    toDatetimeLocal(initialPost?.publishedAt) || toDatetimeLocal(new Date())
  );

  // Mobile tab state
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Link modal state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // --- Tiptap Editor Instance ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-600 underline underline-offset-2 hover:text-emerald-700 cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article here. Select any text and use the toolbar above to format it...",
      }),
    ],
    content: initialPost?.content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate prose-emerald max-w-none focus:outline-none min-h-[400px] p-4 text-slate-800 leading-relaxed",
      },
    },
  });

  // Auto-generate slug
  useEffect(() => {
    if (!dirtySlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [title, dirtySlug]);

  // Auto-generate excerpt from editor HTML content
  useEffect(() => {
    if (!dirtyExcerpt && editor) {
      const plainText = editor.getText().replace(/\n/g, " ").trim();
      if (plainText.length > 0) {
        setExcerpt(plainText.slice(0, 150).trim() + (plainText.length > 150 ? "..." : ""));
      }
    }
  }, [editor, dirtyExcerpt]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setIsUploadingImage(true);
    const storageRef = ref(storage, `blogs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`);
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

  // Link Toolbar Actions
  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const existingLink = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(existingLink || "");
    setIsLinkModalOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = url.startsWith("http") ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setIsLinkModalOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkModalOpen(false);
  }, [editor]);

  const handleSave = async (forceStatus?: "draft" | "published") => {
    if (!editor) return;
    const finalStatus = forceStatus || status;
    const htmlContent = editor.getHTML();

    // Build the publishedAt Date from the datetime-local string
    const publishedAtDate = publishedAt ? new Date(publishedAt) : null;

    const postData = {
      title,
      slug,
      excerpt,
      content: htmlContent,
      coverImage,
      status: finalStatus,
      author: auth.currentUser?.displayName || "Admin User",
      publishedAt: finalStatus === "published" ? publishedAtDate : null,
    };

    try {
      if (initialPost?.id) {
        await updatePost(initialPost.id, postData);
      } else {
        await createPost(postData);
      }
      onSaveComplete();
    } catch {
      // Error is handled in the hook via toast
    }
  };

  const hasContent = editor && !editor.isEmpty;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up flex flex-col h-[85vh]">
      
      {/* Link Modal Overlay */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-600" />
              Insert / Edit Link
            </h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyLink()}
              placeholder="https://example.com"
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={applyLink}
                className="flex-1 py-2.5 bg-kudi-green text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors text-sm"
              >
                Apply Link
              </button>
              <button
                onClick={removeLink}
                className="px-4 py-2.5 text-rose-600 bg-rose-50 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm"
              >
                Remove
              </button>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2.5 text-slate-600 bg-slate-100 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
            disabled={isSaving || !title || !hasContent}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-kudi-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <button
            onClick={() => handleSave("published")}
            disabled={isSaving || !title || !hasContent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-kudi-green hover:bg-emerald-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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

            {/* Publish Date — Backdating Control */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow text-slate-700"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Set a past date to backdate. This controls where the post appears in the timeline.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Excerpt (SEO Preview)</label>
              <textarea
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setDirtyExcerpt(true);
                }}
                rows={3}
                placeholder="A quick 1-2 sentence summary of this article..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-kudi-green focus:border-transparent transition-shadow text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* Tiptap Rich Text Editor */}
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-semibold text-slate-800 mb-2">Article Content *</label>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-white border border-slate-300 rounded-t-xl border-b-0">
              {/* Text Format */}
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("bold") ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Bold"
                type="button"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("italic") ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Italic"
                type="button"
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Headings */}
              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Heading 2"
                type="button"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Heading 3"
                type="button"
              >
                <Heading3 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Lists */}
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("bulletList") ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Bullet List"
                type="button"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("orderedList") ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Numbered List"
                type="button"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Link */}
              <button
                onClick={openLinkModal}
                className={`p-2 rounded-lg transition-colors ${editor?.isActive("link") ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100"}`}
                title="Insert / Edit Link"
                type="button"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                onClick={removeLink}
                disabled={!editor?.isActive("link")}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove Link"
                type="button"
              >
                <Link2Off className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Divider Line */}
              <button
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                title="Divider Line"
                type="button"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-200 mx-1" />

              {/* Undo / Redo */}
              <button
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo"
                type="button"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo"
                type="button"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 bg-white border border-slate-300 rounded-b-xl overflow-y-auto shadow-inner focus-within:ring-2 focus-within:ring-kudi-green focus-within:border-transparent transition-shadow">
              <EditorContent editor={editor} />
            </div>
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

          {coverImage && (
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-48 md:h-64 object-cover rounded-2xl mb-8 shadow-sm"
            />
          )}

          {title && (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {title}
            </h1>
          )}

          {publishedAt && (
            <p className="text-sm text-slate-400 mb-8">
              {new Date(publishedAt).toLocaleDateString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {/* Render the Tiptap HTML output directly */}
          <article
            className="prose prose-slate prose-emerald max-w-none hover:prose-a:text-emerald-600"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "<p class='text-slate-400 italic'>No content written yet...</p>" }}
          />
        </div>
      </div>
    </div>
  );
}

import type { BlogPost } from "../../types/blog";
import { Plus, Edit2, Eye, FileText, Globe } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BlogListManagerProps {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  onEdit: (post: BlogPost) => void;
  onCreateNew: () => void;
}

export function BlogListManager({ posts, isLoading, error, onEdit, onCreateNew }: BlogListManagerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-kudi-green mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm text-slate-500">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
        <p className="text-red-600 font-medium">Failed to load posts: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Content Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your public blog posts and announcements.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Write New Post
        </button>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No posts yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Start driving traffic to your app by writing SEO-optimized articles and product updates.
            </p>
            <button
              onClick={onCreateNew}
              className="text-kudi-green font-medium text-sm hover:text-emerald-500 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create your first post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Article Details
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Last Updated  
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => {
                  const dateToUse = post.updatedAt || post.createdAt;
                  // Handle Firestore Timestamp or standard Date
                  const dateObj =
                    dateToUse && typeof (dateToUse as any).toDate === "function"
                      ? (dateToUse as any).toDate()
                      : new Date(dateToUse as Date);

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {post.coverImage ? (
                            <img 
                              src={post.coverImage} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-kudi-green transition-colors line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px] sm:max-w-xs">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {post.status === "published" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Globe className="w-3.5 h-3.5" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <FileText className="w-3.5 h-3.5" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-slate-600">
                        {dateObj instanceof Date && !isNaN(dateObj.valueOf()) 
                          ? format(dateObj, "MMM d, yyyy") 
                          : "Unknown"}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === "published" && (
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="View Live"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => onEdit(post)}
                            className="p-2 text-slate-400 hover:text-kudi-green hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Post"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

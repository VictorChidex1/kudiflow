import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { usePublishedBlogPosts } from "../hooks/useBlogPosts";
import SEO from "../components/SEO";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";

export default function BlogLanding() {
  const { posts, isLoading, error } = usePublishedBlogPosts();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  // Highlight the first post as the "featured" post only on page 1
  const featuredPost = currentPage === 1 && currentPosts.length > 0 ? currentPosts[0] : null;
  const regularPosts = currentPage === 1 ? currentPosts.slice(1) : currentPosts;

  const getReadingTime = (content: string) => {
    if (!content) return 1;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="KudiFlow Blog | Financial Tech for Smart Vendors"
        description="Learn how to scale your business, manage debtors effectively, and modernize your sales process with the KudiFlow Blog."
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 mt-4">
           <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl min-h-[400px] flex items-center justify-center text-center px-4 py-20 lg:py-32 group">
               <div className="absolute inset-0">
                  <img src="/assets/blog-hero.webp" alt="Blog Hero" className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-[20s] ease-linear" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
               </div>
               
               <div className="relative z-10 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md animate-fade-in-up">
                     <BookOpen className="w-4 h-4" /> KudiFlow Resources
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 animate-fade-in-up animation-delay-150 drop-shadow-lg">
                    The KudiFlow{" "}
                    <span className="text-emerald-400 relative">
                      Journal
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
                    Insights, strategies, and industry news to help you scale your
                    business, manage debtors, and automate point-of-sale like a pro.
                  </p>
               </div>
           </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="animate-spin h-10 w-10 text-emerald-500 mb-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-slate-500 font-medium">
                Loading the latest articles...
              </p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
              <p className="text-rose-600 font-bold mb-2">
                Failed to load articles.
              </p>
              <p className="text-sm text-rose-500">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-20">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No articles yet
              </h3>
              <p className="text-slate-500 leading-relaxed">
                We're currently brewing some amazing content. Check back soon
                for cutting-edge SaaS insights!
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up animation-delay-300">
              {/* Featured Post (Big Card) */}
              {featuredPost && (
                <div className="mb-12 sm:mb-20">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Latest Release
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-slate-50 rounded-4xl p-4 sm:p-6 lg:p-8 hover:bg-slate-100/80 transition-all border border-slate-100 hover:border-emerald-100 shadow-sm hover:shadow-xl"
                  >
                    <div className="h-64 sm:h-80 lg:h-full w-full rounded-3xl overflow-hidden relative">
                      {featuredPost.coverImage ? (
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-tr from-emerald-100 to-teal-50 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-emerald-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center py-4 lg:py-8 lg:pr-8">
                      <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-4 lg:mb-6">
                        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"><Calendar className="w-4 h-4"/> {featuredPost.updatedAt && typeof (featuredPost.updatedAt as any).toDate === "function" ? format((featuredPost.updatedAt as any).toDate(), "MMMM d, yyyy") : format(new Date(featuredPost.updatedAt as any), "MMMM d, yyyy")}</span>
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full"><Clock className="w-4 h-4"/> {getReadingTime(featuredPost.content)} min read</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {featuredPost.excerpt}
                      </p>
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold">
                        Read Full Article{" "}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid of Remaining Posts */}
              {regularPosts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
                    More Articles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all overflow-hidden h-full"
                      >
                        <div className="h-48 sm:h-56 w-full overflow-hidden relative bg-slate-100">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BookOpen className="w-10 h-10 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 sm:p-8 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-lg">
                              Knowledge
                            </span>
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                              {getReadingTime(post.content)} min read
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                            <div className="flex flex-col text-xs font-semibold text-slate-500">
                              <span className="text-slate-900 font-bold">{post.author}</span>
                              <span>{post.updatedAt && typeof (post.updatedAt as any).toDate === "function" ? format((post.updatedAt as any).toDate(), "MMM d, yyyy") : format(new Date(post.updatedAt as any), "MMM d, yyyy")}</span>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white text-slate-400 transition-all shadow-sm">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={currentPage === 1}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        Previous
                      </button>
                      <div className="hidden sm:flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCurrentPage(i + 1);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-11 h-11 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                              currentPage === i + 1 
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105" 
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      <span className="sm:hidden text-sm font-bold text-slate-500 px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => {
                          setCurrentPage(p => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

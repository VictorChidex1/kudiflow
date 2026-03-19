import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Calendar, ChevronRight } from "lucide-react";
import { usePublishedBlogPosts } from "../hooks/useBlogPosts";
import SEO from "../components/SEO";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";

export default function BlogLanding() {
  const { posts, isLoading, error } = usePublishedBlogPosts();

  // Highlight the first post as the "featured" post
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="KudiFlow Blog | Financial Tech for Smart Vendors"
        description="Learn how to scale your business, manage debtors effectively, and modernize your sales process with the KudiFlow Blog."
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
            The KudiFlow{" "}
            <span className="text-kudi-green relative before:absolute before:inset-0 before:bg-emerald-100/50 before:-z-10 before:rounded-lg before:-rotate-2">
              Journal
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-150">
            Insights, strategies, and industry news to help you scale your
            business, manage debtors, and automate point-of-sale like a pro.
          </p>
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
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {featuredPost.updatedAt && typeof (featuredPost.updatedAt as any).toDate === "function" ? format((featuredPost.updatedAt as any).toDate(), "MMMM d, yyyy") : format(new Date(featuredPost.updatedAt as any), "MMMM d, yyyy")}</span>
                        <span>•</span>
                        <span>{featuredPost.author}</span>
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
                          <div className="text-xs font-bold text-emerald-600 mb-3 tracking-wider uppercase">
                            Analysis
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto pt-4 border-t border-slate-100">
                            <span>{post.updatedAt && typeof (post.updatedAt as any).toDate === "function" ? format((post.updatedAt as any).toDate(), "MMM d, yyyy") : format(new Date(post.updatedAt as any), "MMM d, yyyy")}</span>
                            <span className="flex items-center group-hover:text-emerald-600 transition-colors">
                              Read <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
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

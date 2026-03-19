import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useBlogPostBySlug } from "../hooks/useBlogPosts";
import SEO from "../components/SEO";
import { LandingNavbar } from "../components/landing/Navbar";
import { Footer } from "../components/landing/Footer";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } = useBlogPostBySlug(slug);

  const shareUrl = window.location.href;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <SEO title="Article Not Found | KudiFlow" description="This blog post could not be found." />
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Post not found</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${post.title} | KudiFlow`} 
        description={post.excerpt}
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-32 pb-24">
        <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 mb-8 sm:mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>

          {/* Article Header */}
          <header className="mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 sm:mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-slate-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <User className="w-5 h-5 text-slate-400" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  {post.updatedAt && typeof (post.updatedAt as any).toDate === "function" ? format((post.updatedAt as any).toDate(), "MMMM d, yyyy") : format(new Date(post.updatedAt as any), "MMMM d, yyyy")}
                </div>
              </div>
              
              {/* Social Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Share
                </span>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {post.coverImage && (
            <div className="w-full h-64 sm:h-96 rounded-4xl overflow-hidden mb-12 sm:mb-20 shadow-xl shadow-slate-200/50">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg prose-slate prose-emerald max-w-none hover:prose-a:text-emerald-600 prose-img:rounded-3xl prose-headings:font-extrabold prose-h2:text-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

        </article>

        {/* Call to Action Wrapper */}
        <section className="mt-24 sm:mt-32 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 sm:p-16 text-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 relative z-10">
              Ready to automate your business?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
              Join thousands of MSMEs using KudiFlow to track inventory, manage debtors, and process sales offline seamlessly.
            </p>
            <div className="relative z-10">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] hover:-translate-y-1"
              >
                Start for free today
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

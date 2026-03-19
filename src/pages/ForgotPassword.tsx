import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import SEO from "../components/SEO";
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      // To prevent email enumeration attacks, always show success even if the email doesn't exist.
      setIsSuccess(true);
    } catch (err: unknown) {
      const firebaseError = err as Error & { code?: string };
      console.error("Password reset error:", firebaseError);
      
      // Standardize the error so we don't leak information
      if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        // Generic fallback that implies the request went through to prevent enumeration,
        // unless it's a hard network error.
        setIsSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <SEO
        title="Forgot Password"
        description="Reset your KudiFlow password to regain access to your business dashboard."
      />
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-kudi-green focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <img
                src="/assets/logo.webp"
                alt="KudiFlow Logo"
                className="h-full w-full object-contain drop-shadow-sm"
              />
            </div>
            <span className="-ml-3 sm:-ml-4 text-2xl font-extrabold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-kudi-green">
              KudiFlow
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          We'll send you instructions to safely reset it.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-kudi-green" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                If an account exists for <span className="font-bold text-slate-800">{email}</span>,
                we have sent a password reset link. Please check your spam folder if you don't see it within a few minutes.
              </p>
              <Link
                to="/login"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-kudi-green text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all duration-200"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5 pl-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kudi-green focus:border-transparent sm:text-sm bg-slate-50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] bg-kudi-green hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all duration-200 text-white font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

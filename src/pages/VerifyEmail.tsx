import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import SEO from "../components/SEO";
import { auth } from "../lib/firebase";
import { applyActionCode } from "firebase/auth";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to strictly prevent React 18 strict mode double-firing the verification
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    const verifyCode = async () => {
      if (!oobCode) {
        setError("Invalid or missing verification code.");
        setIsVerifying(false);
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setIsSuccess(true);
      } catch (err: unknown) {
        const firebaseError = err as Error & { code?: string };
        console.error("Email verification error:", firebaseError);

        if (firebaseError.code === "auth/invalid-action-code") {
          setError("This link is invalid or your email is already verified.");
        } else {
          setError("Failed to verify email. Please try again.");
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <SEO
        title="Verify Email"
        description="Verify your KudiFlow account email address."
      />

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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 min-h-[300px] flex flex-col justify-center">
          {isVerifying ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center mb-6">
                <svg
                  className="animate-spin h-10 w-10 text-kudi-green"
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
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Verifying your email...
              </h1>
              <p className="text-sm text-slate-500">
                Please wait while we securely confirm your account.
              </p>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-kudi-green" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Email Verified!
              </h1>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Your email has been successfully verified. Your shop is fully secured.
              </p>
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-kudi-green text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-6">
                <ShieldAlert className="h-8 w-8 text-rose-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Verification Failed
              </h1>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                {error}
              </p>
              <Link
                to="/login"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-kudi-green text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all duration-200"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

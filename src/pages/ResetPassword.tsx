import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldAlert, Eye, EyeOff } from "lucide-react";
import SEO from "../components/SEO";
import { auth } from "../lib/firebase";
import { confirmPasswordReset } from "firebase/auth";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setIsSuccess(true);
    } catch (err: unknown) {
      const firebaseError = err as Error & { code?: string };
      console.error("Password reset confirmation error:", firebaseError);
      
      if (
        firebaseError.code === "auth/invalid-action-code" ||
        firebaseError.code === "auth/expired-action-code"
      ) {
        setError("This reset link has expired or is invalid. Please request a new one.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If there's no reset code in the URL, the user shouldn't be here.
  if (!oobCode) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <SEO title="Invalid Reset Link" description="This password reset link is invalid or expired." />
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-6">
              <ShieldAlert className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Invalid or expired password reset link.</h3>
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              This link is no longer valid. If you still need to reset your password, please go back and request a new link.
            </p>
            <Link
              to="/forgot-password"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-kudi-green text-sm font-bold text-white hover:bg-emerald-600 transition-all duration-200"
            >
              Request New Link
            </Link>
            <div className="mt-4">
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <SEO
        title="Create New Password"
        description="Securely create a new password for your KudiFlow account."
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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-kudi-green" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Password Updated</h1>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Your password has been successfully reset. You can now use your new password to access your dashboard.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm bg-kudi-green text-sm font-bold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kudi-green transition-all duration-200"
              >
                Log In Now
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                Create New Password
              </h1>
              <form className="space-y-5" onSubmit={handleReset}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </div>
                )}

                {/* New Password Field */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5 pl-1"
                  >
                    New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kudi-green focus:border-transparent sm:text-sm bg-slate-50 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-1.5 pl-1"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kudi-green focus:border-transparent sm:text-sm bg-slate-50 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword}
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
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

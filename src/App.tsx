import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import { PageLoader } from "./components/ui/PageLoader";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

// Static imports for core app shell components
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RouteScrollToTop } from "./components/ui/RouteScrollToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";

// Lazy load public pages
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then(m => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail").then(m => ({ default: m.VerifyEmail })));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const BlogLanding = lazy(() => import("./pages/BlogLanding"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Lazy load dashboard pages
const DashboardOverview = lazy(() => import("./pages/dashboard/Overview"));
const Inventory = lazy(() => import("./pages/dashboard/Inventory"));
const SalesLedger = lazy(() => import("./pages/dashboard/SalesLedger"));
const Transactions = lazy(() => import("./pages/dashboard/Transactions"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const Debtors = lazy(() => import("./pages/dashboard/Debtors"));
const Expenses = lazy(() => import("./pages/dashboard/Expenses"));
const BlogCMS = lazy(() => import("./pages/dashboard/BlogCMS"));

// Lazy load heavy widgets
const AIChatWidget = lazy(() => import("./components/chat/AIChatWidget").then(m => ({ default: m.AIChatWidget })));

function App() {
  const [showChatWidget, setShowChatWidget] = useState(false);

  useEffect(() => {
    // Delay loading the heavy chat widget to prioritize main thread for LCP
    const timer = setTimeout(() => {
      setShowChatWidget(true);
    }, 4000); // 4 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#334155",
              color: "#fff",
              borderRadius: "12px",
            },
          }}
        />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/blog" element={<BlogLanding />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Phase 1: Protected Core Application Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="sales" element={<SalesLedger />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/cms" element={<BlogCMS />} />
                <Route path="debtors" element={<Debtors />} />
                <Route path="expenses" element={<Expenses />} />
              </Route>
            </Routes>
            {showChatWidget && <AIChatWidget />}
          </Suspense>
        </ErrorBoundary>
        <ScrollToTop />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { VerifyEmail } from "./pages/VerifyEmail";
import DocsPage from "./pages/DocsPage";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import BlogLanding from "./pages/BlogLanding";
import BlogPost from "./pages/BlogPost";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RouteScrollToTop } from "./components/ui/RouteScrollToTop";

// Phase 1: Dashboard Imports
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/Overview";
import Inventory from "./pages/dashboard/Inventory";
import SalesLedger from "./pages/dashboard/SalesLedger";
import Transactions from "./pages/dashboard/Transactions";
import Settings from "./pages/dashboard/Settings";
import Debtors from "./pages/dashboard/Debtors";
import BlogCMS from "./pages/dashboard/BlogCMS";

// Global Chat Widget
import { AIChatWidget } from "./components/chat/AIChatWidget";

function App() {
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
          </Route>
        </Routes>
        <AIChatWidget />
        <ScrollToTop />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

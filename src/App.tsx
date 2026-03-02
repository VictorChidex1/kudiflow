import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import DocsPage from "./pages/DocsPage";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        {/* We will add /dashboard/* later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

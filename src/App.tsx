import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* We will add /login, /signup, and /dashboard/* later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

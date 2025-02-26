
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FreeText from "./pages/FreeText";
import Examples from "./pages/Examples";
import GeneratePDF from "./pages/GeneratePDF";
import Reviews from "./pages/Reviews";
import ResetPassword from "./pages/ResetPassword";
import { LanguageProvider } from "@/hooks/useLanguage";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/free-text" element={<FreeText />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/pdf" element={<GeneratePDF />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        <Toaster />
      </Router>
    </LanguageProvider>
  );
}

export default App;

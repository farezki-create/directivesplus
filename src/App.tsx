
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./hooks/useLanguage";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import ResetPassword from "./pages/ResetPassword";
import FreeText from "./pages/FreeText";
import Examples from "./pages/Examples";
import GeneratePDF from "./pages/GeneratePDF";
import Reviews from "./pages/Reviews";
import FAQ from "./pages/FAQ";
import ModifyDirectives from "./pages/ModifyDirectives";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/free-text" element={<FreeText />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/generate-pdf" element={<GeneratePDF />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/modify-directives" element={<ModifyDirectives />} />
        </Routes>
      </Router>
      <Toaster />
      <Sonner position="top-center" />
    </LanguageProvider>
  );
}

export default App;

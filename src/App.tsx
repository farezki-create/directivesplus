
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

// Import des pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import OTPAuth from "./pages/OTPAuth";
import Rediger from "./pages/Rediger";
import HealthNews from "./pages/HealthNews";
import MentionsLegales from "./pages/MentionsLegales";
import InstitutionAccess from "./pages/InstitutionAccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalMentions from "./pages/LegalMentions";
import DirectivesAccess from "./pages/DirectivesAccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/otp-auth" element={<OTPAuth />} />
                <Route path="/rediger" element={<Rediger />} />
                <Route path="/contact" element={<HealthNews />} />
                <Route path="/actualites-sante" element={<HealthNews />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/acces-institution" element={<InstitutionAccess />} />
                <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                <Route path="/conditions-generales-utilisation" element={<LegalMentions />} />
                <Route path="/directives/:id" element={<DirectivesAccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

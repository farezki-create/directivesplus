
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
import Contact from "./pages/Contact";
import ActualitesSante from "./pages/ActualitesSante";
import MentionsLegales from "./pages/MentionsLegales";
import AccessInstitution from "./pages/AccessInstitution";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ConditionsGeneralesUtilisation from "./pages/ConditionsGeneralesUtilisation";
import Directives from "./pages/Directives";
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/actualites-sante" element={<ActualitesSante />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/acces-institution" element={<AccessInstitution />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/conditions-generales-utilisation" element={<ConditionsGeneralesUtilisation />} />
                <Route path="/directives/:id" element={<Directives />} />
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

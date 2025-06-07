
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
import AvisGeneral from "./pages/AvisGeneral";
import GoutsPeurs from "./pages/GoutsPeurs";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import PersonneConfiance from "./pages/PersonneConfiance";
import Synthese from "./pages/Synthese";
import MesDirectives from "./pages/MesDirectives";
import CarteAcces from "./pages/CarteAcces";
import SuiviPalliatif from "./pages/SuiviPalliatif";
import AccesInstitution from "./pages/AccesInstitution";
import AccesSoinsPalliatifs from "./pages/AccesSoinsPalliatifs";

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
                
                {/* Pages du questionnaire */}
                <Route path="/avis-general" element={<AvisGeneral />} />
                <Route path="/gouts-peurs" element={<GoutsPeurs />} />
                <Route path="/maintien-vie" element={<MaintienVie />} />
                <Route path="/maladie-avancee" element={<MaladieAvancee />} />
                <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
                <Route path="/personne-confiance" element={<PersonneConfiance />} />
                <Route path="/synthese" element={<Synthese />} />
                <Route path="/mes-directives" element={<MesDirectives />} />
                <Route path="/carte-acces" element={<CarteAcces />} />
                <Route path="/suivi-palliatif" element={<SuiviPalliatif />} />
                <Route path="/acces-institution" element={<AccesInstitution />} />
                <Route path="/acces-soins-palliatifs" element={<AccesSoinsPalliatifs />} />
                
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

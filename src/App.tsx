
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
import Rediger from "./pages/Rediger";
import Contact from "./pages/Contact";
import ActualitesSante from "./pages/ActualitesSante";
import MentionsLegales from "./pages/MentionsLegales";
import AccessInstitution from "./pages/AccessInstitution";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ConditionsGeneralesUtilisation from "./pages/ConditionsGeneralesUtilisation";
import Directives from "./pages/Directives";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import Soutenir from "./pages/Soutenir";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import Confidentialite from "./pages/Confidentialite";
import Dashboard from "./pages/Dashboard";
import MesDirectives from "./pages/MesDirectives";
import AccessCode from "./pages/AccessCode";
import PdfViewer from "./pages/PdfViewer";
import PdfDirect from "./pages/PdfDirect";
import Partage from "./pages/Partage";
import AuthAuditComplete from "./pages/AuthAuditComplete";

// Import des pages de questionnaire
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import TraitementsAgressifs from "./pages/TraitementsAgressifs";
import ComfortCare from "./pages/ComfortCare";
import QualiteVie from "./pages/QualiteVie";
import PersonnesConfiance from "./pages/PersonnesConfiance";
import ExemplesPhrasesPage from "./pages/ExemplesPhrasesPage";
import TexteLibre from "./pages/TexteLibre";
import RecapitulatifDirectives from "./pages/RecapitulatifDirectives";
import SignatureDirectives from "./pages/SignatureDirectives";

// Import des pages admin et médicales
import SymptomTracking from "./pages/SymptomTracking";
import DonneesMedicales from "./pages/DonneesMedicales";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Pages principales */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mes-directives" element={<MesDirectives />} />
                <Route path="/codes-acces" element={<AccessCode />} />
                <Route path="/rediger" element={<Rediger />} />
                <Route path="/directives" element={<Directives />} />

                {/* Pages de questionnaire */}
                <Route path="/avis-general" element={<AvisGeneral />} />
                <Route path="/maintien-vie" element={<MaintienVie />} />
                <Route path="/traitements-agressifs" element={<TraitementsAgressifs />} />
                <Route path="/comfort-care" element={<ComfortCare />} />
                <Route path="/qualite-vie" element={<QualiteVie />} />
                <Route path="/personnes-confiance" element={<PersonnesConfiance />} />
                <Route path="/exemples-phrases" element={<ExemplesPhrasesPage />} />
                <Route path="/texte-libre" element={<TexteLibre />} />
                <Route path="/recapitulatif" element={<RecapitulatifDirectives />} />
                <Route path="/signature" element={<SignatureDirectives />} />

                {/* Pages médicales et admin */}
                <Route path="/donnees-medicales" element={<DonneesMedicales />} />
                <Route path="/suivi-soins-palliatifs-had" element={<SymptomTracking />} />
                <Route path="/profile" element={<Profile />} />

                {/* Visualisation et partage */}
                <Route path="/pdf-viewer" element={<PdfViewer />} />
                <Route path="/pdf-direct/:documentId" element={<PdfDirect />} />
                <Route path="/partage/:shareCode" element={<Partage />} />

                {/* Pages informatives */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/actualites-sante" element={<ActualitesSante />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/access-institution" element={<AccessInstitution />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/conditions-generales-utilisation" element={<ConditionsGeneralesUtilisation />} />
                <Route path="/community" element={<Community />} />
                <Route path="/soutenir" element={<Soutenir />} />
                <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
                <Route path="/confidentialite" element={<Confidentialite />} />

                {/* Page d'audit */}
                <Route path="/auth-audit-complete" element={<AuthAuditComplete />} />

                {/* Page 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

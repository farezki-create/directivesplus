
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Index";
import Profile from "./pages/Profile";
import DirectivesAcces from "./pages/DirectivesAcces";
import MesDirectives from "./pages/MesDirectives";
import Partage from "./pages/Partage";
import DirectDocument from "./pages/DirectDocument";
import Auth from "./pages/Auth";
import Rediger from "./pages/Rediger";
import AvisGeneral from "./pages/AvisGeneral";
import GoutsPeurs from "./pages/GoutsPeurs";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import PersonneConfiance from "./pages/PersonneConfiance";
import Synthesis from "./pages/Synthesis";
import Testimonials from "./pages/Testimonials";
import ReportDataBreach from "./pages/ReportDataBreach";
import Soutenir from "./pages/Soutenir";
import NotFound from "./pages/NotFound";
import AffichageDossierRedirect from "./pages/AffichageDossierRedirect";
import MedicalData from "./pages/MedicalData";
import PdfViewer from "./pages/PdfViewer";
import PdfDirect from "./pages/PdfDirect";
import Comments from "./pages/Comments";
import Admin from "./pages/Admin";
import AccesInstitution from "./pages/AccesInstitution";
import Diagnostic from "./pages/Diagnostic";
// Import des pages manquantes
import LegalMentions from "./pages/LegalMentions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import AccessCard from "./pages/AccessCard";
import AccessCode from "./pages/AccessCode";
import AccessDocuments from "./pages/AccessDocuments";
import BackupPolicy from "./pages/BackupPolicy";
import Dashboard from "./pages/Dashboard";
import DataBreachProcedure from "./pages/DataBreachProcedure";
import DataProtectionImpact from "./pages/DataProtectionImpact";
import DirectivesAccess from "./pages/DirectivesAccess";
import DirectivesDocs from "./pages/DirectivesDocs";
import InstitutionAccess from "./pages/InstitutionAccess";
import InstitutionAccessSimple from "./pages/InstitutionAccessSimple";
import MedicalAccess from "./pages/MedicalAccess";
import PlaceholderPage from "./pages/PlaceholderPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/directives-acces" element={<DirectivesAcces />} />
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/partage" element={<Partage />} />
              <Route path="/document/:documentId" element={<DirectDocument />} />
              <Route path="/donnees-medicales" element={<MedicalData />} />
              
              {/* Routes des questionnaires */}
              <Route path="/avis-general" element={<AvisGeneral />} />
              <Route path="/gouts-peurs" element={<GoutsPeurs />} />
              <Route path="/maintien-vie" element={<MaintienVie />} />
              <Route path="/maladie-avancee" element={<MaladieAvancee />} />
              <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
              <Route path="/personne-confiance" element={<PersonneConfiance />} />
              
              {/* Pages principales */}
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/synthese" element={<Synthesis />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/commentaires" element={<Comments />} />
              <Route path="/report-data-breach" element={<ReportDataBreach />} />
              <Route path="/soutenir" element={<Soutenir />} />
              
              {/* Pages légales et informatives */}
              <Route path="/mentions-legales" element={<LegalMentions />} />
              <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
              <Route path="/confidentialite" element={<PrivacyPolicy />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              
              {/* Pages d'accès et cartes */}
              <Route path="/carte-acces" element={<AccessCard />} />
              <Route path="/access-card" element={<AccessCard />} />
              <Route path="/access-code" element={<AccessCode />} />
              <Route path="/access-documents" element={<AccessDocuments />} />
              <Route path="/directives-access" element={<DirectivesAccess />} />
              <Route path="/directives-docs" element={<DirectivesDocs />} />
              
              {/* Pages institution et accès médical */}
              <Route path="/institution-access" element={<InstitutionAccess />} />
              <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
              <Route path="/acces-institution" element={<AccesInstitution />} />
              <Route path="/medical-access" element={<MedicalAccess />} />
              
              {/* Pages admin et diagnostic */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Pages de protection des données */}
              <Route path="/backup-policy" element={<BackupPolicy />} />
              <Route path="/data-breach-procedure" element={<DataBreachProcedure />} />
              <Route path="/data-protection-impact" element={<DataProtectionImpact />} />
              
              {/* Routes de redirection */}
              <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
              
              {/* Routes PDF */}
              <Route path="/pdf-viewer" element={<PdfViewer />} />
              <Route path="/pdf/:documentId" element={<PdfDirect />} />
              
              {/* Page placeholder pour routes non définies */}
              <Route path="/placeholder" element={<PlaceholderPage />} />
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import DirectivesDocs from "@/pages/DirectivesDocs";
import Dashboard from "@/pages/Dashboard";
import DirectivesAcces from "@/pages/DirectivesAcces";
import { Navigate } from "react-router-dom";
import AvisGeneral from "@/pages/AvisGeneral";
import GoutsPeurs from "@/pages/GoutsPeurs";
import MaintienVie from "@/pages/MaintienVie";
import MaladieAvancee from "@/pages/MaladieAvancee";
import ExemplesPhrases from "@/pages/ExemplesPhrases";
import PersonneConfiance from "@/pages/PersonneConfiance";
import Testimonials from "@/pages/Testimonials";
import Soutenir from "@/pages/Soutenir";
import Rediger from "@/pages/Rediger";
import MedicalData from "@/pages/MedicalData";
import Synthesis from "@/pages/Synthesis";
import MedicalAccess from "@/pages/MedicalAccess";
import PlaceholderPage from "@/pages/PlaceholderPage";
import LegalMentions from "@/pages/LegalMentions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ReportDataBreach from "@/pages/ReportDataBreach";
import AccessCardPage from "@/pages/AccessCard";
import EnSavoirPlus from "@/pages/EnSavoirPlus";
import SharedAccessPageContainer from "@/pages/SharedAccessPage";
import InstitutionAccess from "@/pages/InstitutionAccess";

// Import Admin
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import AffichageDossierRedirect from "@/pages/AffichageDossierRedirect";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques, accessibles sans authentification */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/directives-acces" element={<DirectivesAcces />} />
        <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
        <Route path="/acces-document" element={<Navigate to="/directives-docs" replace />} />
        <Route path="/avis-general" element={<AvisGeneral />} />
        <Route path="/gouts-peurs" element={<GoutsPeurs />} />
        <Route path="/maintien-vie" element={<MaintienVie />} />
        <Route path="/maladie-avancee" element={<MaladieAvancee />} />
        <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
        <Route path="/personne-confiance" element={<PersonneConfiance />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/commentaires" element={<Testimonials />} />
        <Route path="/soutenir" element={<Soutenir />} />
        <Route path="/legal" element={<LegalMentions />} />
        <Route path="/confidentialite" element={<PrivacyPolicy />} />
        <Route path="/report-breach" element={<ReportDataBreach />} />
        <Route path="/medical-access" element={<MedicalAccess />} />
        <Route path="/carte-acces" element={<AccessCardPage />} />
        <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
        <Route path="/mentions-legales" element={<LegalMentions />} />
        <Route path="/acces-partage" element={<SharedAccessPageContainer />} />
        <Route path="/acces-institution" element={<InstitutionAccess />} />
        
        {/* Routes avec accès alternatif via PlaceholderPage */}
        <Route path="/:pageId" element={<PlaceholderPage />} />
        
        {/* Routes protégées, nécessitant une authentification */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/directives-docs" 
          element={
            <ProtectedRoute>
              <DirectivesDocs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rediger" 
          element={<Rediger />}
        />
        <Route 
          path="/donnees-medicales" 
          element={<MedicalData />}
        />
        <Route 
          path="/synthese" 
          element={<Synthesis />}
        />
        
        {/* Page non trouvée */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

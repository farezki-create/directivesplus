
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DirectivesInfo from "./pages/DirectivesInfo";
import Rediger from "./pages/Rediger";
import PersonneConfiance from "./pages/PersonneConfiance";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import Synthesis from "./pages/Synthesis";
import MesDirectives from "./pages/MesDirectives";
import DirectivesDocs from "./pages/DirectivesDocs";
import PdfViewer from "./pages/PdfViewer";
import PdfDirect from "./pages/PdfDirect";
import DirectDocument from "./pages/DirectDocument";
import AccessDocuments from "./pages/AccessDocuments";
import DirectivesAccess from "./pages/DirectivesAccess";
import SecureDirectivesAccess from "./pages/SecureDirectivesAccess";
import Soutenir from "./pages/Soutenir";
import Community from "./pages/Community";
import HealthNews from "./pages/HealthNews";
import Partage from "./pages/Partage";
import Commentaires from "./pages/Commentaires";
import Comments from "./pages/Comments";
import Testimonials from "./pages/Testimonials";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import MentionsLegales from "./pages/MentionsLegales";
import LegalMentions from "./pages/LegalMentions";
import Confidentialite from "./pages/Confidentialite";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CarteAcces from "./pages/CarteAcces";
import AccessCard from "./pages/AccessCard";
import AccessCode from "./pages/AccessCode";
import InstitutionAccess from "./pages/InstitutionAccess";
import InstitutionAccessSimple from "./pages/InstitutionAccessSimple";
import AccesInstitution from "./pages/AccesInstitution";
import DirectiveViewer from "./pages/DirectiveViewer";
import SecurityDashboard from "./pages/SecurityDashboard";
import SecurityAuditDashboard from "./pages/SecurityAuditDashboard";
import SecurityAuditReport from "./pages/SecurityAuditReport";
import SecurityAudit from "./pages/SecurityAudit";
import RLSAudit from "./pages/RLSAudit";
import AuthAudit from "./pages/AuthAudit";
import AuthEmailAudit from "./pages/AuthEmailAudit";
import Diagnostic from "./pages/Diagnostic";
import Admin from "./pages/Admin";
import AvisGeneral from "./pages/AvisGeneral";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import PolitiqueSauvegarde from "./pages/PolitiqueSauvegarde";
import BackupPolicy from "./pages/BackupPolicy";
import DataProtectionImpact from "./pages/DataProtectionImpact";
import AnalyseImpactProtectionDonnees from "./pages/AnalyseImpactProtectionDonnees";
import DataBreachProcedure from "./pages/DataBreachProcedure";
import ProcedureViolationDonnees from "./pages/ProcedureViolationDonnees";
import ReportDataBreach from "./pages/ReportDataBreach";
import SuiviSymptomes from "./pages/SuiviSymptomes";
import SuiviPalliatif from "./pages/SuiviPalliatif";
import AlertesSoignants from "./pages/AlertesSoignants";
import SuiviMultiPatients from "./pages/SuiviMultiPatients";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/suivi-symptomes" element={<ProtectedRoute><SuiviSymptomes /></ProtectedRoute>} />
          <Route path="/suivi-palliatif" element={<ProtectedRoute><SuiviPalliatif /></ProtectedRoute>} />
          <Route path="/alertes-soignants" element={<ProtectedRoute><AlertesSoignants /></ProtectedRoute>} />
          <Route path="/suivi-multi-patients" element={<ProtectedRoute><SuiviMultiPatients /></ProtectedRoute>} />
          <Route path="/directives-info" element={<DirectivesInfo />} />
          <Route path="/rediger" element={<ProtectedRoute><Rediger /></ProtectedRoute>} />
          <Route path="/personne-confiance" element={<ProtectedRoute><PersonneConfiance /></ProtectedRoute>} />
          <Route path="/maintien-vie" element={<ProtectedRoute><MaintienVie /></ProtectedRoute>} />
          <Route path="/maladie-avancee" element={<ProtectedRoute><MaladieAvancee /></ProtectedRoute>} />
          <Route path="/gouts-peurs" element={<ProtectedRoute><GoutsPeurs /></ProtectedRoute>} />
          <Route path="/synthesis" element={<ProtectedRoute><Synthesis /></ProtectedRoute>} />
          <Route path="/mes-directives" element={<MesDirectives />} />
          <Route path="/donnees-medicales" element={<ProtectedRoute><DirectivesDocs /></ProtectedRoute>} />
          <Route path="/codes-acces" element={<ProtectedRoute><CarteAcces /></ProtectedRoute>} />
          <Route path="/pdf-viewer/:id" element={<PdfViewer />} />
          <Route path="/pdf-direct/:id" element={<PdfDirect />} />
          <Route path="/direct-document/:documentId" element={<DirectDocument />} />
          <Route path="/access-documents" element={<AccessDocuments />} />
          <Route path="/directives-access" element={<DirectivesAccess />} />
          <Route path="/secure-directives-access" element={<SecureDirectivesAccess />} />
          <Route path="/soutenir" element={<Soutenir />} />
          <Route path="/community" element={<Community />} />
          <Route path="/health-news" element={<HealthNews />} />
          <Route path="/partage" element={<Partage />} />
          <Route path="/commentaires" element={<Commentaires />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
          <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/legal-mentions" element={<LegalMentions />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/carte-acces" element={<ProtectedRoute><CarteAcces /></ProtectedRoute>} />
          <Route path="/access-card" element={<AccessCard />} />
          <Route path="/access-code" element={<AccessCode />} />
          <Route path="/institution-access" element={<InstitutionAccess />} />
          <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
          <Route path="/acces-institution" element={<AccesInstitution />} />
          <Route path="/directive-viewer" element={<DirectiveViewer />} />
          <Route path="/security-dashboard" element={<ProtectedRoute><SecurityDashboard /></ProtectedRoute>} />
          <Route path="/security-audit-dashboard" element={<ProtectedRoute><SecurityAuditDashboard /></ProtectedRoute>} />
          <Route path="/security-audit-report" element={<ProtectedRoute><SecurityAuditReport /></ProtectedRoute>} />
          <Route path="/security-audit" element={<ProtectedRoute><SecurityAudit /></ProtectedRoute>} />
          <Route path="/rls-audit" element={<ProtectedRoute><RLSAudit /></ProtectedRoute>} />
          <Route path="/auth-audit" element={<ProtectedRoute><AuthAudit /></ProtectedRoute>} />
          <Route path="/auth-email-audit" element={<ProtectedRoute><AuthEmailAudit /></ProtectedRoute>} />
          <Route path="/diagnostic" element={<ProtectedRoute><Diagnostic /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/avis-general" element={<AvisGeneral />} />
          <Route path="/politique-sauvegarde" element={<PolitiqueSauvegarde />} />
          <Route path="/backup-policy" element={<BackupPolicy />} />
          <Route path="/data-protection-impact" element={<DataProtectionImpact />} />
          <Route path="/analyse-impact-protection-donnees" element={<AnalyseImpactProtectionDonnees />} />
          <Route path="/data-breach-procedure" element={<DataBreachProcedure />} />
          <Route path="/procedure-violation-donnees" element={<ProcedureViolationDonnees />} />
          <Route path="/report-data-breach" element={<ReportDataBreach />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

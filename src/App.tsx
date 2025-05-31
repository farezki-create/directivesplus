import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import AccessCode from '@/pages/AccessCode';
import RLSAudit from '@/pages/RLSAudit';
import SecurityAudit from '@/pages/SecurityAudit';
import SecurityAuditReportPage from '@/pages/SecurityAuditReport';
import SecurityAuditDashboardPage from '@/pages/SecurityAuditDashboard';
import SecurityDashboard from '@/pages/SecurityDashboard';
import Rediger from '@/pages/Rediger';
import AvisGeneral from '@/pages/AvisGeneral';
import DirectDocument from '@/pages/DirectDocument';
import GoutsPeurs from '@/pages/GoutsPeurs';
import ExemplesPhrases from '@/pages/ExemplesPhrases';
import Diagnostic from '@/pages/Diagnostic';
import HealthNews from '@/pages/HealthNews';
import Admin from '@/pages/Admin';
import Commentaires from '@/pages/Commentaires';
import Comments from '@/pages/Comments';
import DirectivesDocs from '@/pages/DirectivesDocs';
import AccesInstitution from '@/pages/AccesInstitution';
import AccessCard from '@/pages/AccessCard';
import AccessDocuments from '@/pages/AccessDocuments';
import AnalyseImpactProtectionDonnees from '@/pages/AnalyseImpactProtectionDonnees';
import BackupPolicy from '@/pages/BackupPolicy';
import CarteAcces from '@/pages/CarteAcces';
import Community from '@/pages/Community';
import Confidentialite from '@/pages/Confidentialite';
import Dashboard from '@/pages/Dashboard';
import DataBreachProcedure from '@/pages/DataBreachProcedure';
import DataProtectionImpact from '@/pages/DataProtectionImpact';
import DirectiveViewer from '@/pages/DirectiveViewer';
import DirectivesAccess from '@/pages/DirectivesAccess';
import DirectivesInfo from '@/pages/DirectivesInfo';
import EnSavoirPlus from '@/pages/EnSavoirPlus';
import InstitutionAccess from '@/pages/InstitutionAccess';
import InstitutionAccessSimple from '@/pages/InstitutionAccessSimple';
import LegalMentions from '@/pages/LegalMentions';
import MaintienVie from '@/pages/MaintienVie';
import MaladieAvancee from '@/pages/MaladieAvancee';
import MentionsLegales from '@/pages/MentionsLegales';
import MesDirectives from '@/pages/MesDirectives';
import NotFound from '@/pages/NotFound';
import Partage from '@/pages/Partage';
import PdfDirect from '@/pages/PdfDirect';
import PdfViewer from '@/pages/PdfViewer';
import PersonneConfiance from '@/pages/PersonneConfiance';
import PlaceholderPage from '@/pages/PlaceholderPage';
import PolitiqueSauvegarde from '@/pages/PolitiqueSauvegarde';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ProcedureViolationDonnees from '@/pages/ProcedureViolationDonnees';
import ReportDataBreach from '@/pages/ReportDataBreach';
import SecureDirectivesAccess from '@/pages/SecureDirectivesAccess';
import Soutenir from '@/pages/Soutenir';
import Synthesis from '@/pages/Synthesis';
import Testimonials from '@/pages/Testimonials';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <SecurityProvider>
            <AppContent />
          </SecurityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Initialize security monitoring
  useSecurityMonitor();
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/access-code/:documentId" element={<AccessCode />} />
        <Route path="/rls-audit" element={<RLSAudit />} />
        <Route path="/security-audit" element={<SecurityAudit />} />
        <Route path="/security-audit-report" element={<SecurityAuditReportPage />} />
        <Route path="/security-audit-dashboard" element={<SecurityAuditDashboardPage />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route path="/rediger" element={<Rediger />} />
        <Route path="/avis-general" element={<AvisGeneral />} />
        <Route path="/direct-document" element={<DirectDocument />} />
        <Route path="/gouts-peurs" element={<GoutsPeurs />} />
        <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/health-news" element={<HealthNews />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/commentaires" element={<Commentaires />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/directives-docs" element={<DirectivesDocs />} />
        <Route path="/acces-institution" element={<AccesInstitution />} />
        <Route path="/access-card" element={<AccessCard />} />
        <Route path="/access-documents" element={<AccessDocuments />} />
        <Route path="/analyse-impact-protection-donnees" element={<AnalyseImpactProtectionDonnees />} />
        <Route path="/backup-policy" element={<BackupPolicy />} />
        <Route path="/carte-acces" element={<CarteAcces />} />
        <Route path="/community" element={<Community />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data-breach-procedure" element={<DataBreachProcedure />} />
        <Route path="/data-protection-impact" element={<DataProtectionImpact />} />
        <Route path="/directive-viewer" element={<DirectiveViewer />} />
        <Route path="/directives-access" element={<DirectivesAccess />} />
        <Route path="/directives-info" element={<DirectivesInfo />} />
        <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
        <Route path="/institution-access" element={<InstitutionAccess />} />
        <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
        <Route path="/legal-mentions" element={<LegalMentions />} />
        <Route path="/maintien-vie" element={<MaintienVie />} />
        <Route path="/maladie-avancee" element={<MaladieAvancee />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/mes-directives" element={<MesDirectives />} />
        <Route path="/partage" element={<Partage />} />
        <Route path="/pdf-direct" element={<PdfDirect />} />
        <Route path="/pdf-viewer" element={<PdfViewer />} />
        <Route path="/personne-confiance" element={<PersonneConfiance />} />
        <Route path="/placeholder" element={<PlaceholderPage />} />
        <Route path="/politique-sauvegarde" element={<PolitiqueSauvegarde />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/procedure-violation-donnees" element={<ProcedureViolationDonnees />} />
        <Route path="/report-data-breach" element={<ReportDataBreach />} />
        <Route path="/secure-directives-access" element={<SecureDirectivesAccess />} />
        <Route path="/soutenir" element={<Soutenir />} />
        <Route path="/synthesis" element={<Synthesis />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

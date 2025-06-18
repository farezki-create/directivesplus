import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import DirectivesInfo from "@/pages/DirectivesInfo";
import Rediger from "@/pages/Rediger";
import Synthesis from "@/pages/Synthesis";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import MesDirectives from "@/pages/MesDirectives";
import Directives from "@/pages/Directives";
import PdfViewer from "@/pages/PdfViewer";
import EnSavoirPlus from "@/pages/EnSavoirPlus";
import Contact from "@/pages/Contact";
import Soutenir from "@/pages/Soutenir";
import DonCarteBancaire from "@/pages/DonCarteBancaire";
import LegalMentions from "@/pages/LegalMentions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ConditionsGeneralesUtilisation from "@/pages/ConditionsGeneralesUtilisation";
import Confidentialite from "@/pages/Confidentialite";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";
import MentionsLegales from "@/pages/MentionsLegales";
import CarteAcces from "@/pages/CarteAcces";
import AccessCard from "@/pages/AccessCard";
import DirectivesAccess from "@/pages/DirectivesAccess";
import AccessDocuments from "@/pages/AccessDocuments";
import PdfDirect from "@/pages/PdfDirect";
import DirectDocument from "@/pages/DirectDocument";
import SecureDirectivesAccess from "@/pages/SecureDirectivesAccess";
import AlertManagement from "@/pages/AlertManagement";
import SuiviPalliatif from "@/pages/SuiviPalliatif";
import SuiviMultiPatients from "@/pages/SuiviMultiPatients";
import PartageSymptomes from "@/pages/PartageSymptomes";
import SuiviSymptomes from "@/pages/SuiviSymptomes";
import AccesInstitution from "@/pages/AccesInstitution";
import AccessInstitution from "@/pages/AccessInstitution";
import InstitutionAccess from "@/pages/InstitutionAccess";
import InstitutionAccessSimple from "@/pages/InstitutionAccessSimple";
import AccesSoinsPalliatifs from "@/pages/AccesSoinsPalliatifs";
import Community from "@/pages/Community";
import Testimonials from "@/pages/Testimonials";
import DirectiveViewer from "@/pages/DirectiveViewer";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import Admin from "@/pages/Admin";
import AdminUsers from "@/pages/AdminUsers";
import AdminMainDashboard from "@/pages/AdminMainDashboard";
import AdminInstitutions from "@/pages/AdminInstitutions";
import AdminFeedback from "@/pages/AdminFeedback";
import AdminStats from "@/pages/AdminStats";
import AdminMonitoring from "@/pages/AdminMonitoring";
import AdminOptimization from "@/pages/AdminOptimization";
import AdminStrictRLS from "@/pages/AdminStrictRLS";
import AdminSupabaseAudit from "@/pages/AdminSupabaseAudit";
import SecurityAuditPage from "@/pages/SecurityAuditPage";
import SupabaseAuditPage from "@/pages/SupabaseAuditPage";
import AuthAudit from "@/pages/AuthAudit";
import AuthAuditComplete from "@/pages/AuthAuditComplete";

// Questionnaire pages
import PersonneConfiance from "@/pages/PersonneConfiance";
import MaintienVie from "@/pages/MaintienVie";
import MaladieAvancee from "@/pages/MaladieAvancee";
import GoutsPeurs from "@/pages/GoutsPeurs";
import ExemplesPhrases from "@/pages/ExemplesPhrases";

// Legal and compliance pages
import DataProtectionImpact from "@/pages/DataProtectionImpact";
import AnalyseImpactProtectionDonnees from "@/pages/AnalyseImpactProtectionDonnees";
import DataBreachProcedure from "@/pages/DataBreachProcedure";
import ProcedureViolationDonnees from "@/pages/ProcedureViolationDonnees";
import ReportDataBreach from "@/pages/ReportDataBreach";
import BackupPolicy from "@/pages/BackupPolicy";
import PolitiqueSauvegarde from "@/pages/PolitiqueSauvegarde";

// Other pages
import DemandeAbonnementInstitutionnel from "@/pages/DemandeAbonnementInstitutionnel";
import EspaceAbonneInstitution from "@/pages/EspaceAbonneInstitution";
import TableauBordInstitution from "@/pages/TableauBordInstitution";
import AlertesSoignants from "@/pages/AlertesSoignants";
import ActualitesSante from "@/pages/ActualitesSante";
import HealthNews from "@/pages/HealthNews";
import ProfileCompletion from "@/pages/ProfileCompletion";
import Diagnostic from "@/pages/Diagnostic";
import Comments from "@/pages/Comments";
import Commentaires from "@/pages/Commentaires";
import AvisGeneral from "@/pages/AvisGeneral";
import Partage from "@/pages/Partage";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/directives-info" element={<DirectivesInfo />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/don-carte-bancaire" element={<DonCarteBancaire />} />
              <Route path="/legal-mentions" element={<LegalMentions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/conditions-generales-utilisation" element={<ConditionsGeneralesUtilisation />} />
              <Route path="/confidentialite" element={<Confidentialite />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/community" element={<Community />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/commentaires" element={<Commentaires />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/avis-general" element={<AvisGeneral />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />

              {/* Document access routes */}
              <Route path="/acces-directives" element={<DirectivesAccess />} />
              <Route path="/access-documents" element={<AccessDocuments />} />
              <Route path="/pdf-direct/:documentId" element={<PdfDirect />} />
              <Route path="/direct-document/:shareCode" element={<DirectDocument />} />
              <Route path="/secure-directives-access" element={<SecureDirectivesAccess />} />
              <Route path="/directive-viewer/:id" element={<DirectiveViewer />} />

              {/* Institution access */}
              <Route path="/acces-institution" element={<AccesInstitution />} />
              <Route path="/access-institution" element={<AccessInstitution />} />
              <Route path="/institution-access" element={<InstitutionAccess />} />
              <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
              <Route path="/acces-soins-palliatifs" element={<AccesSoinsPalliatifs />} />

              {/* Institution subscription */}
              <Route path="/demande-abonnement-institutionnel" element={<DemandeAbonnementInstitutionnel />} />
              <Route path="/espace-abonne-institution" element={<EspaceAbonneInstitution />} />
              <Route path="/tableau-bord-institution" element={<TableauBordInstitution />} />
              <Route path="/alertes-soignants" element={<AlertesSoignants />} />

              {/* Health News */}
              <Route path="/actualites-sante" element={<ActualitesSante />} />
              <Route path="/health-news" element={<HealthNews />} />

              {/* Legal and compliance */}
              <Route path="/data-protection-impact" element={<DataProtectionImpact />} />
              <Route path="/analyse-impact-protection-donnees" element={<AnalyseImpactProtectionDonnees />} />
              <Route path="/data-breach-procedure" element={<DataBreachProcedure />} />
              <Route path="/procedure-violation-donnees" element={<ProcedureViolationDonnees />} />
              <Route path="/report-data-breach" element={<ReportDataBreach />} />
              <Route path="/backup-policy" element={<BackupPolicy />} />
              <Route path="/politique-sauvegarde" element={<PolitiqueSauvegarde />} />

              {/* Protected routes */}
              <Route path="/rediger" element={
                <ProtectedRoute>
                  <Rediger />
                </ProtectedRoute>
              } />
              <Route path="/synthesis" element={
                <ProtectedRoute>
                  <Synthesis />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile-completion" element={
                <ProtectedRoute>
                  <ProfileCompletion />
                </ProtectedRoute>
              } />
              <Route path="/mes-directives" element={
                <ProtectedRoute>
                  <MesDirectives />
                </ProtectedRoute>
              } />
              <Route path="/directives" element={
                <ProtectedRoute>
                  <Directives />
                </ProtectedRoute>
              } />
              <Route path="/pdf-viewer" element={
                <ProtectedRoute>
                  <PdfViewer />
                </ProtectedRoute>
              } />
              <Route path="/carte-acces" element={
                <ProtectedRoute>
                  <CarteAcces />
                </ProtectedRoute>
              } />
              <Route path="/access-card" element={
                <ProtectedRoute>
                  <AccessCard />
                </ProtectedRoute>
              } />
              <Route path="/alert-management" element={
                <ProtectedRoute>
                  <AlertManagement />
                </ProtectedRoute>
              } />
              <Route path="/suivi-palliatif" element={
                <ProtectedRoute>
                  <SuiviPalliatif />
                </ProtectedRoute>
              } />
              <Route path="/suivi-multi-patients" element={
                <ProtectedRoute>
                  <SuiviMultiPatients />
                </ProtectedRoute>
              } />
              <Route path="/partage-symptomes" element={
                <ProtectedRoute>
                  <PartageSymptomes />
                </ProtectedRoute>
              } />
              <Route path="/suivi-symptomes" element={
                <ProtectedRoute>
                  <SuiviSymptomes />
                </ProtectedRoute>
              } />
              <Route path="/partage" element={
                <ProtectedRoute>
                  <Partage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Questionnaire routes */}
              <Route path="/personne-confiance" element={
                <ProtectedRoute>
                  <PersonneConfiance />
                </ProtectedRoute>
              } />
              <Route path="/maintien-vie" element={
                <ProtectedRoute>
                  <MaintienVie />
                </ProtectedRoute>
              } />
              <Route path="/maladie-avancee" element={
                <ProtectedRoute>
                  <MaladieAvancee />
                </ProtectedRoute>
              } />
              <Route path="/gouts-peurs" element={
                <ProtectedRoute>
                  <GoutsPeurs />
                </ProtectedRoute>
              } />
              <Route path="/exemples-phrases" element={
                <ProtectedRoute>
                  <ExemplesPhrases />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminRequired>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminRequired>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminRequired>
                  <AdminMainDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/institutions" element={
                <ProtectedRoute adminRequired>
                  <AdminInstitutions />
                </ProtectedRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedRoute adminRequired>
                  <AdminFeedback />
                </ProtectedRoute>
              } />
              <Route path="/admin/stats" element={
                <ProtectedRoute adminRequired>
                  <AdminStats />
                </ProtectedRoute>
              } />
              <Route path="/admin/monitoring" element={
                <ProtectedRoute adminRequired>
                  <AdminMonitoring />
                </ProtectedRoute>
              } />
              <Route path="/admin/optimization" element={
                <ProtectedRoute adminRequired>
                  <AdminOptimization />
                </ProtectedRoute>
              } />
              <Route path="/admin/strict-rls" element={
                <ProtectedRoute adminRequired>
                  <AdminStrictRLS />
                </ProtectedRoute>
              } />
              <Route path="/admin/supabase-audit" element={
                <ProtectedRoute adminRequired>
                  <AdminSupabaseAudit />
                </ProtectedRoute>
              } />
              <Route path="/security-audit" element={
                <ProtectedRoute adminRequired>
                  <SecurityAuditPage />
                </ProtectedRoute>
              } />
              <Route path="/supabase-audit" element={
                <ProtectedRoute adminRequired>
                  <SupabaseAuditPage />
                </ProtectedRoute>
              } />
              <Route path="/auth-audit" element={
                <ProtectedRoute adminRequired>
                  <AuthAudit />
                </ProtectedRoute>
              } />
              <Route path="/auth-audit-complete" element={
                <ProtectedRoute adminRequired>
                  <AuthAuditComplete />
                </ProtectedRoute>
              } />

              {/* Debug and diagnostic */}
              <Route path="/diagnostic" element={
                <ProtectedRoute adminRequired>
                  <Diagnostic />
                </ProtectedRoute>
              } />

              {/* Placeholder for other features */}
              <Route path="/placeholder/:feature" element={<PlaceholderPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <CookieBanner />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

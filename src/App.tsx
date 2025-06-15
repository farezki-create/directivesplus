import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";

// Pages principales
import Index from "./pages/Index";
import Rediger from "./pages/Rediger";
import Synthesis from "./pages/Synthesis";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DirectivesAccess from "./pages/DirectivesAccess";
import AccessCode from "./pages/AccessCode";
import MesDirectives from "./pages/MesDirectives";
import AccesInstitution from "./pages/AccesInstitution";
import PdfViewer from "./pages/PdfViewer";
import Auth from "./pages/Auth";
import SuiviPalliatif from "./pages/SuiviPalliatif";
import SuiviMultiPatients from "./pages/SuiviMultiPatients";
import AccesSoinsPalliatifs from "./pages/AccesSoinsPalliatifs";
import PersonneConfiance from "./pages/PersonneConfiance";
import Community from "./pages/Community";
import SecurityAuditPage from "./pages/SecurityAuditPage";
import SupabaseAuditPage from "./pages/SupabaseAuditPage";

// Pages Admin
import Admin from "./pages/Admin";
import AdminMainDashboardPage from "./pages/AdminMainDashboard";
import AdminInstitutions from "./pages/AdminInstitutions";
import AdminSupabaseAudit from "./pages/AdminSupabaseAudit";
import AdminUsers from "./pages/AdminUsers";
import AdminMonitoring from "./pages/AdminMonitoring";
import AdminOptimization from "./pages/AdminOptimization";
import AdminStats from "./pages/AdminStats";

// Pages d'audit
import AuthAudit from "./pages/AuthAudit";
import DirectivesInfo from "./pages/DirectivesInfo";
import Soutenir from "./pages/Soutenir";
import AuthAuditPage from "./features/auth/AuthAuditPage";

// Pages de questionnaires
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import CarteAcces from "./pages/CarteAcces";

// Pages légales
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Confidentialite from "./pages/Confidentialite";
import EnSavoirPlus from "./pages/EnSavoirPlus";

// Composant de chargement
import { LoadingFallback } from "@/utils/performance/lazyComponents";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SecurityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/rediger" element={<ProtectedRoute><Rediger /></ProtectedRoute>} />
                  <Route path="/synthesis" element={<ProtectedRoute><Synthesis /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/directives-access" element={<DirectivesAccess />} />
                  <Route path="/access-code" element={<AccessCode />} />
                  <Route path="/mes-directives" element={<MesDirectives />} />
                  <Route path="/acces-institution" element={<AccesInstitution />} />
                  <Route path="/pdf-viewer/:documentId" element={<ProtectedRoute><PdfViewer /></ProtectedRoute>} />
                  
                  {/* Pages Admin avec protection renforcée */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminMainDashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/institutions" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminInstitutions />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/monitoring" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminMonitoring />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/optimization" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminOptimization />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/stats" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminStats />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/supabase-audit" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSupabaseAudit />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/security-audit" element={
                    <ProtectedRoute requireAdmin={true}>
                      <SecurityAuditPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Pages d'audit autonomes */}
                  <Route path="/security-audit" element={
                    <ProtectedRoute requireAdmin={true}>
                      <SecurityAuditPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/supabase-audit" element={
                    <ProtectedRoute requireAdmin={true}>
                      <SupabaseAuditPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/auth-audit" element={<AuthAudit />} />
                  <Route path="/auth-audit-detailed" element={<AuthAuditPage />} />
                  <Route path="/directives-info" element={<DirectivesInfo />} />
                  <Route path="/soutenir" element={<Soutenir />} />
                  <Route path="/carte-acces" element={<CarteAcces />} />
                  <Route path="/suivi-palliatif" element={<ProtectedRoute><SuiviPalliatif /></ProtectedRoute>} />
                  <Route path="/suivi-multi-patients" element={<ProtectedRoute><SuiviMultiPatients /></ProtectedRoute>} />
                  <Route path="/acces-soins-palliatifs" element={<AccesSoinsPalliatifs />} />
                  <Route path="/personne-confiance" element={<PersonneConfiance />} />
                  <Route path="/community" element={<Community />} />
                  
                  {/* Routes des questionnaires */}
                  <Route path="/avis-general" element={<ProtectedRoute><AvisGeneral /></ProtectedRoute>} />
                  <Route path="/maintien-vie" element={<ProtectedRoute><MaintienVie /></ProtectedRoute>} />
                  <Route path="/maladie-avancee" element={<ProtectedRoute><MaladieAvancee /></ProtectedRoute>} />
                  <Route path="/gouts-peurs" element={<ProtectedRoute><GoutsPeurs /></ProtectedRoute>} />
                  <Route path="/exemples-phrases" element={<ProtectedRoute><ExemplesPhrases /></ProtectedRoute>} />

                  {/* Routes légales */}
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/confidentialite" element={<Confidentialite />} />
                  <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

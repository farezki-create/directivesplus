

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthAudit from "./pages/AuthAudit";
import SecurityAuditPage from "./pages/SecurityAuditPage";
import Admin from "./pages/Admin";
import AdminStrictRLS from "./pages/AdminStrictRLS";
import Rediger from "./pages/Rediger";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Directives from "./pages/Directives";
import DirectivesAccess from "./pages/DirectivesAccess";
import AccessCard from "./pages/AccessCard";
import CarteAcces from "./pages/CarteAcces";
import MesDirectives from "./pages/MesDirectives";
import Synthesis from "./pages/Synthesis";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Soutenir from "./pages/Soutenir";
import DirectivesInfo from "./pages/DirectivesInfo";
import AdminUsers from "./pages/AdminUsers";
import AdminMainDashboard from "./pages/AdminMainDashboard";
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import HealthNews from "./pages/HealthNews";
import InstitutionAccess from "./pages/InstitutionAccess";
import MentionsLegales from "./pages/MentionsLegales";
import LegalMentions from "./pages/LegalMentions";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import Confidentialite from "./pages/Confidentialite";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import DonCarteBancaire from "./pages/DonCarteBancaire";
import SuiviPalliatif from "./pages/SuiviPalliatif";
import SuiviMultiPatients from "./pages/SuiviMultiPatients";
import AlertesSoignants from "./pages/AlertesSoignants";
import AlertManagement from "./pages/AlertManagement";
import AdminSupabaseAudit from "./pages/AdminSupabaseAudit";
import SupabaseAuditPage from "./pages/SupabaseAuditPage";
import AdminMonitoring from "./pages/AdminMonitoring";
import AdminOptimization from "./pages/AdminOptimization";
import AdminStats from "./pages/AdminStats";
import AdminInstitutions from "./pages/AdminInstitutions";
import AdminHealthNews from "./pages/AdminHealthNews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/directives" element={<Directives />} />
            <Route path="/directives-access" element={<DirectivesAccess />} />
            <Route path="/access-card" element={<AccessCard />} />
            <Route path="/carte-acces" element={<CarteAcces />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/synthesis" element={<Synthesis />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/directives-info" element={<DirectivesInfo />} />
            <Route path="/auth-audit" element={<AuthAudit />} />
            <Route path="/avis-general" element={<AvisGeneral />} />
            <Route path="/maintien-vie" element={<MaintienVie />} />
            <Route path="/maladie-avancee" element={<MaladieAvancee />} />
            <Route path="/gouts-peurs" element={<GoutsPeurs />} />
            <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
            <Route path="/actualites-sante" element={<HealthNews />} />
            <Route path="/acces-institution" element={<InstitutionAccess />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/legal-mentions" element={<LegalMentions />} />
            <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/don-carte-bancaire" element={<DonCarteBancaire />} />
            <Route path="/suivi-palliatif" element={<SuiviPalliatif />} />
            <Route path="/suivi-multi-patients" element={<SuiviMultiPatients />} />
            <Route path="/alertes-soignants" element={<AlertesSoignants />} />
            <Route path="/alertes" element={<AlertesSoignants />} />
            <Route path="/alert-management" element={<AlertManagement />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/security-audit" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SecurityAuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security-audit-report" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SecurityAuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/strict-rls" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminStrictRLS />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/supabase-audit" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminSupabaseAudit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supabase-audit" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SupabaseAuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/monitoring" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMonitoring />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/optimization" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminOptimization />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stats" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminStats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/institutions" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminInstitutions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/health-news" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminHealthNews />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


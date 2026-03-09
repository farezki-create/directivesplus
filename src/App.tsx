import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";

// Eager load: landing page and auth (critical path)
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy load: all other pages
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthAudit = lazy(() => import("./pages/AuthAudit"));
const SecurityAuditPage = lazy(() => import("./pages/SecurityAuditPage"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminStrictRLS = lazy(() => import("./pages/AdminStrictRLS"));
const Rediger = lazy(() => import("./pages/Rediger"));
const Profile = lazy(() => import("./pages/Profile"));
const Directives = lazy(() => import("./pages/Directives"));
const DirectivesAccess = lazy(() => import("./pages/DirectivesAccess"));
const AccessCard = lazy(() => import("./pages/AccessCard"));
const CarteAcces = lazy(() => import("./pages/CarteAcces"));
const MesDirectives = lazy(() => import("./pages/MesDirectives"));
const Synthesis = lazy(() => import("./pages/Synthesis"));
const Community = lazy(() => import("./pages/Community"));
const Contact = lazy(() => import("./pages/Contact"));
const Soutenir = lazy(() => import("./pages/Soutenir"));
const DirectivesInfo = lazy(() => import("./pages/DirectivesInfo"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminMainDashboard = lazy(() => import("./pages/AdminMainDashboard"));
const AvisGeneral = lazy(() => import("./pages/AvisGeneral"));
const MaintienVie = lazy(() => import("./pages/MaintienVie"));
const MaladieAvancee = lazy(() => import("./pages/MaladieAvancee"));
const GoutsPeurs = lazy(() => import("./pages/GoutsPeurs"));
const ExemplesPhrases = lazy(() => import("./pages/ExemplesPhrases"));
const InstitutionAccess = lazy(() => import("./pages/InstitutionAccess"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const EnSavoirPlus = lazy(() => import("./pages/EnSavoirPlus"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const DonCarteBancaire = lazy(() => import("./pages/DonCarteBancaire"));
const SuiviPalliatif = lazy(() => import("./pages/SuiviPalliatif"));
const SuiviMultiPatients = lazy(() => import("./pages/SuiviMultiPatients"));
const AlertesSoignants = lazy(() => import("./pages/AlertesSoignants"));
const SupabaseAuditPage = lazy(() => import("./pages/SupabaseAuditPage"));
const AdminMonitoring = lazy(() => import("./pages/AdminMonitoring"));
const AdminOptimization = lazy(() => import("./pages/AdminOptimization"));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const AdminInstitutions = lazy(() => import("./pages/AdminInstitutions"));
const AlertContactsPage = lazy(() => import("./pages/AlertContactsPage"));
const AlertManagementPage = lazy(() => import("./pages/AlertManagementPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SecurityProvider>
            <Router>
              <div className="App">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
                    
                    <Route path="/acces-institution" element={<InstitutionAccess />} />
                    <Route path="/mentions-legales" element={<MentionsLegales />} />
                    <Route path="/legal-mentions" element={<Navigate to="/mentions-legales" replace />} />
                    <Route path="/confidentialite" element={<Navigate to="/politique-confidentialite" replace />} />
                    <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                    <Route path="/don-carte-bancaire" element={<DonCarteBancaire />} />
                    <Route path="/suivi-palliatif" element={<SuiviPalliatif />} />
                    <Route path="/suivi-multi-patients" element={<SuiviMultiPatients />} />
                    <Route path="/alertes-soignants" element={<AlertesSoignants />} />
                    <Route path="/alertes" element={<AlertesSoignants />} />
                    <Route path="/alert-contacts" element={<AlertContactsPage />} />
                    <Route path="/alert-management" element={<AlertManagementPage />} />
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
                      element={<Navigate to="/admin/security-audit" replace />}
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
                          <SupabaseAuditPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/supabase-audit" 
                      element={<Navigate to="/admin/supabase-audit" replace />}
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </SecurityProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
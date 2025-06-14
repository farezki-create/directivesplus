
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import Admin from "./pages/Admin";
import AdminMainDashboardPage from "./pages/AdminMainDashboard";
import AdminInstitutions from "./pages/AdminInstitutions";
import AdminSupabaseAudit from "./pages/AdminSupabaseAudit";
import AuthAudit from "./pages/AuthAudit";
import DirectivesInfo from "./pages/DirectivesInfo";
import Soutenir from "./pages/Soutenir";
import AuthAuditPage from "./features/auth/AuthAuditPage";
import Auth from "./pages/Auth";
import SuiviPalliatif from "./pages/SuiviPalliatif";
import AccesSoinsPalliatifs from "./pages/AccesSoinsPalliatifs";
import PersonneConfiance from "./pages/PersonneConfiance";

// Pages de questionnaires
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import CarteAcces from "./pages/CarteAcces";

// Composant de chargement
import { LoadingFallback } from "@/utils/performance/lazyComponents";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/rediger" element={<Rediger />} />
                <Route path="/synthesis" element={<Synthesis />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/directives-access" element={<DirectivesAccess />} />
                <Route path="/access-code" element={<AccessCode />} />
                <Route path="/mes-directives" element={<MesDirectives />} />
                <Route path="/acces-institution" element={<AccesInstitution />} />
                <Route path="/pdf-viewer/:documentId" element={<PdfViewer />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dashboard" element={<AdminMainDashboardPage />} />
                <Route path="/admin/institutions" element={<AdminInstitutions />} />
                <Route path="/admin/supabase-audit" element={<AdminSupabaseAudit />} />
                <Route path="/auth-audit" element={<AuthAudit />} />
                <Route path="/auth-audit-detailed" element={<AuthAuditPage />} />
                <Route path="/directives-info" element={<DirectivesInfo />} />
                <Route path="/soutenir" element={<Soutenir />} />
                <Route path="/carte-acces" element={<CarteAcces />} />
                <Route path="/suivi-palliatif" element={<SuiviPalliatif />} />
                <Route path="/acces-soins-palliatifs" element={<AccesSoinsPalliatifs />} />
                <Route path="/personne-confiance" element={<PersonneConfiance />} />
                
                {/* Routes des questionnaires */}
                <Route path="/avis-general" element={<AvisGeneral />} />
                <Route path="/maintien-vie" element={<MaintienVie />} />
                <Route path="/maladie-avancee" element={<MaladieAvancee />} />
                <Route path="/gouts-peurs" element={<GoutsPeurs />} />
                <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

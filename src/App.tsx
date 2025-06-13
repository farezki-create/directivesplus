
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Index from "./pages/Index";
import Rediger from "./pages/Rediger";
import Questionnaire from "./pages/Questionnaire";
import Synthesis from "./pages/Synthesis";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DirectivesAccess from "./pages/DirectivesAccess";
import SharedDocument from "./pages/SharedDocument";
import AccessCode from "./pages/AccessCode";
import MesDirectives from "./pages/MesDirectives";
import AccesInstitution from "./pages/AccesInstitution";
import PdfViewer from "./pages/PdfViewer";
import Admin from "./pages/Admin";
import AdminInstitutions from "./pages/AdminInstitutions";
import AdminSupabaseAudit from "./pages/AdminSupabaseAudit";
import AuthAudit from "./pages/AuthAudit";
import DirectivesInfo from "./pages/DirectivesInfo";
import ProtectionDonnees from "./pages/ProtectionDonnees";
import Soutenir from "./pages/Soutenir";
import Social from "./pages/Social";
import SymptomTracker from "./pages/SymptomTracker";
import { AuthAuditPage } from "./features/auth/AuthAuditPage";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/directives-access" element={<DirectivesAccess />} />
              <Route path="/shared/:documentId" element={<SharedDocument />} />
              <Route path="/access-code" element={<AccessCode />} />
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/acces-institution" element={<AccesInstitution />} />
              <Route path="/pdf-viewer/:documentId" element={<PdfViewer />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/institutions" element={<AdminInstitutions />} />
              <Route path="/admin/supabase-audit" element={<AdminSupabaseAudit />} />
              <Route path="/auth-audit" element={<AuthAudit />} />
              <Route path="/auth-audit-detailed" element={<AuthAuditPage />} />
              <Route path="/directives-info" element={<DirectivesInfo />} />
              <Route path="/protection-donnees" element={<ProtectionDonnees />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/social" element={<Social />} />
              <Route path="/symptom-tracker" element={<SymptomTracker />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

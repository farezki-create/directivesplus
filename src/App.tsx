
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MedicalData from "./pages/MedicalData";
import MedicalAccess from "./pages/MedicalAccess";
import Rediger from "./pages/Rediger";
import PersonneConfiance from "./pages/PersonneConfiance";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import Synthesis from "./pages/Synthesis";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import AccessCard from "./pages/AccessCard";
import MesDirectives from "./pages/MesDirectives";
import DirectDocument from "./pages/DirectDocument";
import Partage from "./pages/Partage";
import DirectivesAccess from "./pages/DirectivesAccess";
import DirectivesAcces from "./pages/DirectivesAcces";
import AccessDocuments from "./pages/AccessDocuments";
import AccessCode from "./pages/AccessCode";
import InstitutionAccess from "./pages/InstitutionAccess";
import InstitutionAccessSimple from "./pages/InstitutionAccessSimple";
import AccesInstitution from "./pages/AccesInstitution";
import AffichageDossierRedirect from "./pages/AffichageDossierRedirect";
import Diagnostic from "./pages/Diagnostic";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import Testimonials from "./pages/Testimonials";
import Comments from "./pages/Comments";
import AvisGeneral from "./pages/AvisGeneral";
import Soutenir from "./pages/Soutenir";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalMentions from "./pages/LegalMentions";
import BackupPolicy from "./pages/BackupPolicy";
import DataProtectionImpact from "./pages/DataProtectionImpact";
import DataBreachProcedure from "./pages/DataBreachProcedure";
import ReportDataBreach from "./pages/ReportDataBreach";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medical-data" element={<MedicalData />} />
            <Route path="/medical-access" element={<MedicalAccess />} />
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/personne-confiance" element={<PersonneConfiance />} />
            <Route path="/maintien-vie" element={<MaintienVie />} />
            <Route path="/maladie-avancee" element={<MaladieAvancee />} />
            <Route path="/gouts-peurs" element={<GoutsPeurs />} />
            <Route path="/synthesis" element={<Synthesis />} />
            <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
            <Route path="/access-card" element={<AccessCard />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/document/:documentId" element={<DirectDocument />} />
            <Route path="/partage/:shareCode" element={<Partage />} />
            <Route path="/directives-access" element={<DirectivesAccess />} />
            <Route path="/directives-acces" element={<DirectivesAcces />} />
            <Route path="/access-documents" element={<AccessDocuments />} />
            <Route path="/access-code" element={<AccessCode />} />
            <Route path="/institution-access" element={<InstitutionAccess />} />
            <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
            <Route path="/acces-institution" element={<AccesInstitution />} />
            <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/avis-general" element={<AvisGeneral />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal-mentions" element={<LegalMentions />} />
            <Route path="/backup-policy" element={<BackupPolicy />} />
            <Route path="/data-protection-impact" element={<DataProtectionImpact />} />
            <Route path="/data-breach-procedure" element={<DataBreachProcedure />} />
            <Route path="/report-data-breach" element={<ReportDataBreach />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

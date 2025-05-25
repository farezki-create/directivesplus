
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Rediger from "./pages/Rediger";
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import PersonneConfiance from "./pages/PersonneConfiance";
import Synthesis from "./pages/Synthesis";
import CarteAcces from "./pages/CarteAcces";
import MesDirectives from "./pages/MesDirectives";
import DirectivesAccess from "./pages/DirectivesAccess";
import InstitutionAccess from "./pages/InstitutionAccess";
import MedicalData from "./pages/MedicalData";
import Testimonials from "./pages/Testimonials";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import PdfViewer from "./pages/PdfViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/avis-general" element={<AvisGeneral />} />
              <Route path="/maintien-vie" element={<MaintienVie />} />
              <Route path="/maladie-avancee" element={<MaladieAvancee />} />
              <Route path="/gouts-peurs" element={<GoutsPeurs />} />
              <Route path="/personne-confiance" element={<PersonneConfiance />} />
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/carte-acces" element={<CarteAcces />} />
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/directives-acces" element={<DirectivesAccess />} />
              <Route path="/institution-access" element={<InstitutionAccess />} />
              <Route path="/donnees-medicales" element={<MedicalData />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              <Route path="/pdf-viewer" element={<PdfViewer />} />
              {/* Redirection pour les anciennes URLs */}
              <Route path="/affichage-dossier" element={<NotFound />} />
              <Route path="/affichage-dossier-redirect" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

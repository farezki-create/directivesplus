
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import InstitutionAccess from "./pages/InstitutionAccess";
import MedicalData from "./pages/MedicalData";
import Testimonials from "./pages/Testimonials";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import PdfViewer from "./pages/PdfViewer";
import Soutenir from "./pages/Soutenir";
import Comments from "./pages/Comments";
import DirectivesInfo from "./pages/DirectivesInfo";
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
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/rediger" element={
                <ProtectedRoute>
                  <Rediger />
                </ProtectedRoute>
              } />
              <Route path="/avis-general" element={
                <ProtectedRoute>
                  <AvisGeneral />
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
              <Route path="/personne-confiance" element={
                <ProtectedRoute>
                  <PersonneConfiance />
                </ProtectedRoute>
              } />
              <Route path="/synthesis" element={
                <ProtectedRoute>
                  <Synthesis />
                </ProtectedRoute>
              } />
              <Route path="/carte-acces" element={
                <ProtectedRoute>
                  <CarteAcces />
                </ProtectedRoute>
              } />
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/institution-access" element={<InstitutionAccess />} />
              <Route path="/donnees-medicales" element={
                <ProtectedRoute>
                  <MedicalData />
                </ProtectedRoute>
              } />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              <Route path="/pdf-viewer" element={<PdfViewer />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/commentaires" element={<Comments />} />
              <Route path="/directives-info" element={<DirectivesInfo />} />
              {/* Redirection pour les anciennes URLs */}
              <Route path="/directives-acces" element={<MesDirectives />} />
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


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Index";
import Profile from "./pages/Profile";
import DirectivesAcces from "./pages/DirectivesAcces";
import MesDirectives from "./pages/MesDirectives";
import Partage from "./pages/Partage";
import DirectDocument from "./pages/DirectDocument";
import Auth from "./pages/Auth";
import Rediger from "./pages/Rediger";
import GoutsPeurs from "./pages/GoutsPeurs";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import PersonneConfiance from "./pages/PersonneConfiance";
import Synthesis from "./pages/Synthesis";
import Testimonials from "./pages/Testimonials";
import ReportDataBreach from "./pages/ReportDataBreach";
import Soutenir from "./pages/Soutenir";
import NotFound from "./pages/NotFound";
import AffichageDossierRedirect from "./pages/AffichageDossierRedirect";
import MedicalData from "./pages/MedicalData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "sonner";
import PdfViewer from "./pages/PdfViewer";
import PdfDirect from "./pages/PdfDirect";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/directives-acces" element={<DirectivesAcces />} />
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/partage" element={<Partage />} />
              <Route path="/document/:documentId" element={<DirectDocument />} />
              <Route path="/donnees-medicales" element={<MedicalData />} />
              
              {/* Routes des questionnaires */}
              <Route path="/gouts-peurs" element={<GoutsPeurs />} />
              <Route path="/maintien-vie" element={<MaintienVie />} />
              <Route path="/maladie-avancee" element={<MaladieAvancee />} />
              <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
              <Route path="/personne-confiance" element={<PersonneConfiance />} />
              
              {/* Autres pages */}
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/report-data-breach" element={<ReportDataBreach />} />
              <Route path="/soutenir" element={<Soutenir />} />
              
              {/* Routes de redirection */}
              <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
              
              {/* Routes PDF */}
              <Route path="/pdf-viewer" element={<PdfViewer />} />
              <Route path="/pdf/:documentId" element={<PdfDirect />} />
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

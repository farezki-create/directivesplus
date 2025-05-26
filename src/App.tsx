
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Rediger from "./pages/Rediger";
import CarteAcces from "./pages/CarteAcces";
import DirectivesAccess from "./pages/DirectivesAccess";
import AffichageDossier from "./pages/AffichageDossier";
import MesDirectives from "./pages/MesDirectives";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PDFViewer from "./pages/PDFViewer";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/rediger" 
              element={
                <ProtectedRoute>
                  <Rediger />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/carte-acces" 
              element={
                <ProtectedRoute>
                  <CarteAcces />
                </ProtectedRoute>
              } 
            />
            <Route path="/directives-access" element={<DirectivesAccess />} />
            <Route path="/affichage-dossier" element={<AffichageDossier />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/pdf-viewer" element={<PDFViewer />} />
            
            {/* Redirection pour les anciennes routes médicales */}
            <Route path="/donnees-medicales" element={<Navigate to="/" replace />} />
            <Route path="/medical-access" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;


import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import DirectivesDocs from "@/pages/DirectivesDocs";
import Dashboard from "@/pages/Dashboard";
import DirectivesAcces from "@/pages/DirectivesAcces";
import { Navigate } from "react-router-dom";
import MesDirectives from "@/pages/MesDirectives";
import AvisGeneral from "@/pages/AvisGeneral"; // Added import for AvisGeneral
// Import Admin
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import AffichageDossierRedirect from "@/pages/AffichageDossierRedirect";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques, accessibles sans authentification */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mes-directives" element={<MesDirectives />} />
        <Route path="/directives-acces" element={<DirectivesAcces />} />
        <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
        <Route path="/acces-document" element={<Navigate to="/directives-docs" replace />} />
        <Route path="/avis-general" element={<AvisGeneral />} /> {/* Added route for AvisGeneral */}
        
        {/* Routes protégées, nécessitant une authentification */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/directives-docs" 
          element={
            <ProtectedRoute>
              <DirectivesDocs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* Page non trouvée */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route, HashRouter, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./hooks/useLanguage";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import ResetPassword from "./pages/ResetPassword";
import FreeText from "./pages/FreeText";
import Examples from "./pages/Examples";
import GeneratePDF from "./pages/GeneratePDF";
import Reviews from "./pages/Reviews";
import FAQ from "./pages/FAQ";
import GeneralOpinion from "./pages/GeneralOpinion";
import LifeSupport from "./pages/LifeSupport";
import AdvancedIllness from "./pages/AdvancedIllness";
import Preferences from "./pages/Preferences";
import MyDocuments from "./pages/MyDocuments";
import ExternalAccess from "./pages/ExternalAccess";
import { DialogStateProvider } from "./hooks/useDialogState";

function App() {
  return (
    <LanguageProvider>
      <DialogStateProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/free-text" element={<FreeText />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/generate-pdf" element={<GeneratePDF />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/general-opinion" element={<GeneralOpinion />} />
            <Route path="/life-support" element={<LifeSupport />} />
            <Route path="/advanced-illness" element={<AdvancedIllness />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/my-documents" element={<MyDocuments />} />
            <Route path="/access" element={<ExternalAccess />} />
            
            {/* Redirection des anciens chemins vers les nouveaux */}
            <Route 
              path="/scalingo-directives/access/*" 
              element={<Navigate to="/access" replace />} 
            />
            <Route 
              path="/scalingo/access/*" 
              element={<Navigate to="/access" replace />} 
            />
            <Route 
              path="/directives/access/*" 
              element={<Navigate to="/access" replace />} 
            />
            <Route 
              path="/scalingo/my-documents/*" 
              element={<Navigate to="/my-documents" replace />} 
            />
            <Route 
              path="/directives/my-documents/*" 
              element={<Navigate to="/my-documents" replace />} 
            />
            
            {/* Ajout de la redirection pour le nouveau lien simplifié */}
            <Route 
              path="/documents.sante.fr/access" 
              element={<Navigate to="/access" replace />} 
            />
          </Routes>
        </HashRouter>
        <Toaster />
        <Sonner position="top-center" />
      </DialogStateProvider>
    </LanguageProvider>
  );
}

export default App;


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
import { DialogStateProvider } from "./hooks/useDialogState";
import { PDFStorageService } from './utils/storage/PDFStorageService';
import { ScalingoHDSStorageProvider } from './utils/cloud/ScalingoHDSStorageProvider';

function App() {
  PDFStorageService.setStorageProvider(new ScalingoHDSStorageProvider());

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
            
            {/* Catch-all redirect for data URLs that might be clicked accidentally */}
            <Route 
              path="data:application/*" 
              element={<Navigate to="/generate-pdf" replace />} 
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

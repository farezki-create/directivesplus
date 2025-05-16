
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Rediger from "@/pages/Rediger";
import Profile from "@/pages/Profile";
import Synthesis from "@/pages/Synthesis";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import PlaceholderPage from "@/pages/PlaceholderPage";
import DirectivesDocs from "@/pages/DirectivesDocs";
import MedicalData from "@/pages/MedicalData";
import AccessDocuments from "@/pages/AccessDocuments";
import AvisGeneral from "@/pages/AvisGeneral";
import MaintienVie from "@/pages/MaintienVie";
import MaladieAvancee from "@/pages/MaladieAvancee";
import GoutsPeurs from "@/pages/GoutsPeurs";
import ExemplesPhrases from "@/pages/ExemplesPhrases";
import PersonneConfiance from "@/pages/PersonneConfiance";
import AccessCardPage from "./pages/AccessCard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataProtectionImpact from "./pages/DataProtectionImpact";
import BackupPolicy from "./pages/BackupPolicy";
import DataBreachProcedure from "./pages/DataBreachProcedure";
import ReportDataBreach from "./pages/ReportDataBreach";

import "./App.css";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rediger" element={<Rediger />} />
          <Route path="/synthesis" element={<Synthesis />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mes-directives" element={<DirectivesDocs />} />
          <Route path="/donnees-medicales" element={<MedicalData />} />
          <Route path="/acces-document" element={<AccessDocuments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
          <Route path="/analyse-impact-protection-donnees" element={<DataProtectionImpact />} />
          <Route path="/politique-sauvegarde" element={<BackupPolicy />} />
          <Route path="/procedure-violation-donnees" element={<DataBreachProcedure />} />
          <Route path="/signaler-violation" element={<ReportDataBreach />} />
          
          {/* Questionnaire section routes with proper protection */}
          <Route path="/avis-general" element={<AvisGeneral />} />
          <Route path="/maintien-vie" element={<MaintienVie />} />
          <Route path="/maladie-avancee" element={<MaladieAvancee />} />
          <Route path="/gouts-peurs" element={<GoutsPeurs />} />
          <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
          <Route path="/personne-confiance" element={<PersonneConfiance />} />
          <Route path="/synthese" element={<Synthesis />} />
          
          <Route path="/carte-acces" element={<AccessCardPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;

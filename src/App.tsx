
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

import "./App.css";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;

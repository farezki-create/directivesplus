
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import DirectivesDocs from "@/pages/DirectivesDocs";
import Dashboard from "@/pages/Dashboard";
import AffichageDossier from "@/pages/AffichageDossier";
import DirectivesAcces from "@/pages/DirectivesAcces";
// Import Admin
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/directives-docs" element={<DirectivesDocs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/affichage-dossier" element={<AffichageDossier />} />
        <Route path="/directives-acces" element={<DirectivesAcces />} />
        {/* Admin Route */}
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SecurityAudit from "./pages/SecurityAudit";
import SecurityAuditReportPage from "./pages/SecurityAuditReport";
import SecurityAuditDashboardPage from "./pages/SecurityAuditDashboard";
import Index from "./pages/Index";
import Rediger from "./pages/Rediger";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import LegalMentions from "./pages/LegalMentions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Soutenir from "./pages/Soutenir";
import InstitutionAccess from "./pages/InstitutionAccess";

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/security-audit" element={<SecurityAudit />} />
              <Route path="/security-audit-report" element={<SecurityAuditReportPage />} />
              <Route path="/security-dashboard" element={<SecurityAuditDashboardPage />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              <Route path="/mentions-legales" element={<LegalMentions />} />
              <Route path="/confidentialite" element={<PrivacyPolicy />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/acces-institution" element={<InstitutionAccess />} />
            </Routes>
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

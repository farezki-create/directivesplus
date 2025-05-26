import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import DossierMedical from "./pages/DossierMedical";
import RedigerDirective from "./pages/RedigerDirective";
import DirectivesList from "./pages/DirectivesList";
import ViewDirective from "./pages/ViewDirective";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AccessLogs from "./pages/AccessLogs";
import DataBreachReportPage from "./pages/DataBreachReportPage";
import SecurityAudit from "./pages/SecurityAudit";
import SecurityAuditReportPage from "./pages/SecurityAuditReport";

import SecurityAuditDashboardPage from "./pages/SecurityAuditDashboard";

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/dossier-medical" element={<DossierMedical />} />
              <Route path="/rediger" element={<RedigerDirective />} />
              <Route path="/directives" element={<DirectivesList />} />
              <Route path="/view-directive/:id" element={<ViewDirective />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/access-logs" element={<AccessLogs />} />
              <Route path="/data-breach-report" element={<DataBreachReportPage />} />
              
              <Route path="/security-audit" element={<SecurityAudit />} />
              <Route path="/security-audit-report" element={<SecurityAuditReportPage />} />
              <Route path="/security-dashboard" element={<SecurityAuditDashboardPage />} />
            </Routes>
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

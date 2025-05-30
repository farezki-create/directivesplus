import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Dossier from '@/pages/Dossier';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import SharedProfile from '@/pages/SharedProfile';
import AccessCode from '@/pages/AccessCode';
import RLSAudit from '@/pages/RLSAudit';
import SecurityAudit from '@/pages/SecurityAudit';
import SecurityAuditReportPage from '@/pages/SecurityAuditReport';
import SecurityAuditDashboardPage from '@/pages/SecurityAuditDashboard';
import SecurityDashboard from '@/pages/SecurityDashboard';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <SecurityProvider>
            <AppContent />
          </SecurityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

function AppContent() {
  // Initialize security monitoring
  useSecurityMonitor();
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dossier/:id" element={<Dossier />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shared-profile/:id" element={<SharedProfile />} />
        <Route path="/access-code/:documentId" element={<AccessCode />} />
        <Route path="/rls-audit" element={<RLSAudit />} />
        <Route path="/security-audit" element={<SecurityAudit />} />
        <Route path="/security-audit-report" element={<SecurityAuditReportPage />} />
        <Route path="/security-audit-dashboard" element={<SecurityAuditDashboardPage />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
      </Routes>
    </div>
  );
}

export default App;

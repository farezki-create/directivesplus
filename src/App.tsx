
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import AccessCode from '@/pages/AccessCode';
import RLSAudit from '@/pages/RLSAudit';
import SecurityAudit from '@/pages/SecurityAudit';
import SecurityAuditReportPage from '@/pages/SecurityAuditReport';
import SecurityAuditDashboardPage from '@/pages/SecurityAuditDashboard';
import SecurityDashboard from '@/pages/SecurityDashboard';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SecurityProvider>
            <AppContent />
          </SecurityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Initialize security monitoring
  useSecurityMonitor();
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
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

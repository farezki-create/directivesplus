import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import AccessCodeEntry from './pages/AccessCodeEntry';
import MesDirectives from './pages/MesDirectives';
import AdminDashboard from './pages/AdminDashboard';
import AdminStrictRLS from './pages/AdminStrictRLS';
import SystemMonitoring from './pages/SystemMonitoring';
import DataBreachReporting from './pages/DataBreachReporting';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from 'react-query';
import { SecurityProvider } from './contexts/SecurityContext';
import DirectivesAccess from './pages/DirectivesAccess';
import { Alertes } from './pages/Alertes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClient>
          <SecurityProvider>
            <div className="min-h-screen bg-white">
              <Toaster />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AccessCodeEntry />} />
                <Route path="/mes-directives" element={<MesDirectives />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/strict-rls" element={<AdminStrictRLS />} />
                <Route path="/system-monitoring" element={<SystemMonitoring />} />
                <Route path="/data-breach-reporting" element={<DataBreachReporting />} />
                <Route path="/directives-access" element={<DirectivesAccess />} />
                <Route path="/alertes" element={<Alertes />} />
              </Routes>
            </div>
          </SecurityProvider>
        </QueryClient>
      </AuthProvider>
    </Router>
  );
}

export default App;

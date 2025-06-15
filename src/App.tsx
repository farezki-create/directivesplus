
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// Utilisation de pages existantes ou placeholders en attendant leur création
import Index from './pages/Index';
import Auth from './pages/Auth';
import MesDirectives from './pages/MesDirectives';
import AdminStrictRLS from './pages/AdminStrictRLS';
// Les pages suivantes peuvent ne pas exister, donc on utilise des composants vides/placeholder
const AdminDashboard = () => <div>Dashboard Admin (placeholder)</div>;
const SystemMonitoring = () => <div>System Monitoring (placeholder)</div>;
const DataBreachReporting = () => <div>Data Breach Reporting (placeholder)</div>;
import { Toaster } from '@/components/ui/toaster';

// Correction de l'import de react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Sécurité : si SecurityProvider n'existe pas, commenter ces lignes
// import { SecurityProvider } from './contexts/SecurityContext';
// const SecurityProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

import DirectivesAccess from './pages/DirectivesAccess';
import Alertes from './pages/Alertes'; // correction de l'import (export défaut)

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {/* <SecurityProvider> */}
            <div className="min-h-screen bg-white">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mes-directives" element={<MesDirectives />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/strict-rls" element={<AdminStrictRLS />} />
                <Route path="/system-monitoring" element={<SystemMonitoring />} />
                <Route path="/data-breach-reporting" element={<DataBreachReporting />} />
                <Route path="/directives-access" element={<DirectivesAccess />} />
                <Route path="/alertes" element={<Alertes />} />
              </Routes>
            </div>
          {/* </SecurityProvider> */}
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

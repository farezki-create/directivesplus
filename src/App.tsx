
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';
import DirectivesDocs from './pages/DirectivesDocs';
import Profile from './pages/Profile';
import DirectivesAcces from './pages/DirectivesAcces';
import Partage from "@/pages/Partage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<DirectivesDocs />} />
            <Route path="/directives" element={<DirectivesDocs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/directives-acces" element={<DirectivesAcces />} />
            
            {/* Route publique pour le partage de documents */}
            <Route path="/partage/:shareCode" element={<Partage />} />
          </Routes>
        </AuthProvider>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

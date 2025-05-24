import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import DirectivesDocs from './pages/DirectivesDocs';
import MedicalDocs from './pages/MedicalDocs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import DirectivesAcces from './pages/DirectivesAcces';
import EditProfile from './pages/EditProfile';
import Partage from "@/pages/Partage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/directives" element={<DirectivesDocs />} />
              <Route path="/medical" element={<MedicalDocs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/directives-acces" element={<DirectivesAcces />} />
              
              {/* Route publique pour le partage de documents */}
              <Route path="/partage/:shareCode" element={<Partage />} />
            </Routes>
          </AuthProvider>
        </div>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import MesDirectives from './pages/MesDirectives';
import CarteAcces from './pages/CarteAcces';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PdfDirect from './pages/PdfDirect';
import DirectDocument from './pages/DirectDocument';
import AccessCardPage from './pages/AccessCard';
import PdfViewer from './pages/PdfViewer';
import DirectiveViewer from './pages/DirectiveViewer';
import Rediger from './pages/Rediger';
import AccesInstitution from './pages/AccesInstitution';
import EnSavoirPlus from './pages/EnSavoirPlus';
import LegalMentions from './pages/LegalMentions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Comments from './pages/Comments';
import Soutenir from './pages/Soutenir';
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/carte-acces" element={<CarteAcces />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pdf-direct/:documentId" element={<PdfDirect />} />
            <Route path="/direct-document/:documentId" element={<DirectDocument />} />
            <Route path="/access-card" element={<AccessCardPage />} />
            <Route path="/pdf-viewer" element={<PdfViewer />} />
            <Route path="/directive-viewer/:directiveId" element={<DirectiveViewer />} />
            <Route path="/acces-institution" element={<AccesInstitution />} />
            <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
            <Route path="/mentions-legales" element={<LegalMentions />} />
            <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
            <Route path="/confidentialite" element={<PrivacyPolicy />} />
            <Route path="/commentaires" element={<Comments />} />
            <Route path="/soutenir" element={<Soutenir />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthContextProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import RedigerDirectives from './pages/RedigerDirectives';
import MesDirectives from './pages/MesDirectives';
import CarteAcces from './pages/CarteAcces';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import PdfDirect from './pages/PdfDirect';
import DirectDocument from './pages/DirectDocument';
import AccessCardPage from './pages/AccessCard';
import PdfViewer from './pages/PdfViewer';
import DirectiveViewer from './pages/DirectiveViewer';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthContextProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/rediger" element={<RedigerDirectives />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/carte-acces" element={<CarteAcces />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pdf-direct/:documentId" element={<PdfDirect />} />
            <Route path="/direct-document/:documentId" element={<DirectDocument />} />
            <Route path="/access-card" element={<AccessCardPage />} />
            <Route path="/pdf-viewer" element={<PdfViewer />} />
            <Route path="/directive-viewer/:directiveId" element={<DirectiveViewer />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;

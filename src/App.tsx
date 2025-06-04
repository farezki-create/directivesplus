
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SuiviPalliatif from './pages/SuiviPalliatif';
import SuiviMultiPatients from './pages/SuiviMultiPatients';
import PartageSymptomes from "@/pages/PartageSymptomes";
import Index from './pages/Index';
import AccesInstitution from './pages/AccesInstitution';
import AccesSoinsPalliatifs from './pages/AccesSoinsPalliatifs';
import DemandeAbonnementInstitutionnel from './pages/DemandeAbonnementInstitutionnel';
import TableauBordInstitution from './pages/TableauBordInstitution';
import EspaceAbonneInstitution from './pages/EspaceAbonneInstitution';
import Rediger from './pages/Rediger';
import AvisGeneral from './pages/AvisGeneral';
import MaintienVie from './pages/MaintienVie';
import MaladieAvancee from './pages/MaladieAvancee';
import GoutsPeurs from './pages/GoutsPeurs';
import PersonneConfiance from './pages/PersonneConfiance';
import ExemplesPhrases from './pages/ExemplesPhrases';
import Synthesis from './pages/Synthesis';
import MesDirectives from './pages/MesDirectives';
import CarteAcces from './pages/CarteAcces';
import Profile from './pages/Profile';
import AdminInstitutions from './pages/AdminInstitutions';
import AuthAudit from './pages/AuthAudit';
import AuthAuditComplete from './pages/AuthAuditComplete';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth-audit" element={<AuthAudit />} />
              <Route path="/auth-audit-complete" element={<AuthAuditComplete />} />
              <Route path="/acces-institution" element={<AccesInstitution />} />
              <Route path="/acces-soins-palliatifs" element={<AccesSoinsPalliatifs />} />
              <Route path="/demande-abonnement-institutionnel" element={<DemandeAbonnementInstitutionnel />} />
              <Route path="/tableau-bord-institution" element={<TableauBordInstitution />} />
              <Route path="/espace-abonne-institution" element={<EspaceAbonneInstitution />} />
              
              {/* Nouvelle route pour l'administration des institutions */}
              <Route 
                path="/admin/institutions" 
                element={
                  <ProtectedRoute>
                    <AdminInstitutions />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/rediger" 
                element={
                  <ProtectedRoute>
                    <Rediger />
                  </ProtectedRoute>
                } 
              />
              
              {/* Pages de rédaction des directives */}
              <Route 
                path="/avis-general" 
                element={
                  <ProtectedRoute>
                    <AvisGeneral />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/maintien-vie" 
                element={
                  <ProtectedRoute>
                    <MaintienVie />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/maladie-avancee" 
                element={
                  <ProtectedRoute>
                    <MaladieAvancee />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/gouts-peurs" 
                element={
                  <ProtectedRoute>
                    <GoutsPeurs />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/personne-confiance" 
                element={
                  <ProtectedRoute>
                    <PersonneConfiance />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/exemples-phrases" 
                element={
                  <ProtectedRoute>
                    <ExemplesPhrases />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/synthesis" 
                element={
                  <ProtectedRoute>
                    <Synthesis />
                  </ProtectedRoute>
                } 
              />
              
              {/* Pages Mes Directives et Carte d'Accès */}
              <Route 
                path="/mes-directives" 
                element={
                  <ProtectedRoute>
                    <MesDirectives />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/carte-acces" 
                element={
                  <ProtectedRoute>
                    <CarteAcces />
                  </ProtectedRoute>
                } 
              />
              
              {/* Page Profile */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/suivi-palliatif" 
                element={
                  <ProtectedRoute>
                    <SuiviPalliatif />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path="/suivi-multi-patients" 
                element={
                  <ProtectedRoute>
                    <SuiviMultiPatients />
                  </ProtectedRoute>
                } 
              />
              <Route path="/partage/suivi" element={<PartageSymptomes />} />
            </Routes>

            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

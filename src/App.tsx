
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import SecurityAudit from "./pages/SecurityAudit";
import SecurityAuditReportPage from "./pages/SecurityAuditReport";
import SecurityAuditDashboardPage from "./pages/SecurityAuditDashboard";
import Index from "./pages/Index";
import Rediger from "./pages/Rediger";
import EnSavoirPlus from "./pages/EnSavoirPlus";
import LegalMentions from "./pages/LegalMentions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Soutenir from "./pages/Soutenir";
import InstitutionAccess from "./pages/InstitutionAccess";
import AvisGeneral from "./pages/AvisGeneral";
import MaintienVie from "./pages/MaintienVie";
import MaladieAvancee from "./pages/MaladieAvancee";
import GoutsPeurs from "./pages/GoutsPeurs";
import PersonneConfiance from "./pages/PersonneConfiance";
import ExemplesPhrases from "./pages/ExemplesPhrases";
import MesDirectives from "./pages/MesDirectives";
import DirectivesDocs from "./pages/DirectivesDocs";
import DirectivesAccess from "./pages/DirectivesAccess";
import Synthesis from "./pages/Synthesis";
import CarteAcces from "./pages/CarteAcces";
import AccessCard from "./pages/AccessCard";
import MedicalData from "./pages/MedicalData";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/security-audit" element={<SecurityAudit />} />
              <Route path="/security-audit-report" element={<SecurityAuditReportPage />} />
              <Route path="/security-dashboard" element={<SecurityAuditDashboardPage />} />
              <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
              <Route path="/mentions-legales" element={<LegalMentions />} />
              <Route path="/confidentialite" element={<PrivacyPolicy />} />
              <Route path="/soutenir" element={<Soutenir />} />
              <Route path="/acces-institution" element={<InstitutionAccess />} />
              
              {/* Routes protégées pour les questionnaires */}
              <Route path="/avis-general" element={
                <ProtectedRoute>
                  <AvisGeneral />
                </ProtectedRoute>
              } />
              <Route path="/maintien-vie" element={
                <ProtectedRoute>
                  <MaintienVie />
                </ProtectedRoute>
              } />
              <Route path="/maladie-avancee" element={
                <ProtectedRoute>
                  <MaladieAvancee />
                </ProtectedRoute>
              } />
              <Route path="/gouts-peurs" element={
                <ProtectedRoute>
                  <GoutsPeurs />
                </ProtectedRoute>
              } />
              <Route path="/personne-confiance" element={
                <ProtectedRoute>
                  <PersonneConfiance />
                </ProtectedRoute>
              } />
              <Route path="/exemples-phrases" element={
                <ProtectedRoute>
                  <ExemplesPhrases />
                </ProtectedRoute>
              } />
              
              {/* Routes pour les directives */}
              <Route path="/mes-directives" element={<MesDirectives />} />
              <Route path="/directives-docs" element={<DirectivesDocs />} />
              <Route path="/directives-acces" element={<DirectivesAccess />} />
              
              {/* Route pour les données médicales */}
              <Route path="/donnees-medicales" element={<MedicalData />} />
              <Route path="/medical-data" element={<MedicalData />} />
              
              {/* Routes protégées pour la synthèse et carte d'accès */}
              <Route path="/synthese" element={
                <ProtectedRoute>
                  <Synthesis />
                </ProtectedRoute>
              } />
              <Route path="/synthesis" element={
                <ProtectedRoute>
                  <Synthesis />
                </ProtectedRoute>
              } />
              <Route path="/carte-acces" element={
                <ProtectedRoute>
                  <CarteAcces />
                </ProtectedRoute>
              } />
              <Route path="/access-card" element={
                <ProtectedRoute>
                  <AccessCard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

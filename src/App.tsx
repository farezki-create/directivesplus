
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SuiviPalliatif from './pages/SuiviPalliatif';
import SuiviMultiPatients from './pages/SuiviMultiPatients';
import PartageSymptomes from "@/pages/PartageSymptomes";
import Index from './pages/Index';
import AccesInstitution from './pages/AccesInstitution';
import Rediger from './pages/Rediger';
import AvisGeneral from './pages/AvisGeneral';
import MaintienVie from './pages/MaintienVie';
import MaladieAvancee from './pages/MaladieAvancee';
import GoutsPeurs from './pages/GoutsPeurs';
import PersonneConfiance from './pages/PersonneConfiance';
import ExemplesPhrases from './pages/ExemplesPhrases';
import Synthesis from './pages/Synthesis';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/acces-institution" element={<AccesInstitution />} />
          
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
      </Router>
    </AuthProvider>
  );
}

export default App;

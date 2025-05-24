import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';

// Import des pages principales
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DirectivesDocs from './pages/DirectivesDocs';
import Profile from './pages/Profile';
import DirectivesAcces from './pages/DirectivesAcces';
import Partage from "@/pages/Partage";

// Import des pages du questionnaire
import Rediger from './pages/Rediger';
import PlaceholderPage from './pages/PlaceholderPage';
import AvisGeneral from './pages/AvisGeneral';
import MaintienVie from './pages/MaintienVie';
import MaladieAvancee from './pages/MaladieAvancee';
import GoutsPeurs from './pages/GoutsPeurs';
import PersonneConfiance from './pages/PersonneConfiance';
import ExemplesPhrases from './pages/ExemplesPhrases';

// Import des pages d'accès
import DirectivesAccess from './pages/DirectivesAccess';
import MedicalAccess from './pages/MedicalAccess';
import AccessDocuments from './pages/AccessDocuments';
import InstitutionAccess from './pages/InstitutionAccess';
import InstitutionAccessSimple from './pages/InstitutionAccessSimple';

// Import des pages médicales et de données
import MedicalData from './pages/MedicalData';
import MesDirectives from './pages/MesDirectives';
import Synthesis from './pages/Synthesis';

// Import des pages d'administration et codes d'accès
import Admin from './pages/Admin';
import AccessCode from './pages/AccessCode';
import AccessCard from './pages/AccessCard';

// Import des pages d'information et support
import EnSavoirPlus from './pages/EnSavoirPlus';
import Soutenir from './pages/Soutenir';
import Comments from './pages/Comments';
import Testimonials from './pages/Testimonials';

// Import des pages utilitaires
import ReportDataBreach from './pages/ReportDataBreach';
import Diagnostic from './pages/Diagnostic';
import AccesInstitution from './pages/AccesInstitution';
import AffichageDossierRedirect from './pages/AffichageDossierRedirect';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<Index />} />
            
            {/* Authentification */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Tableau de bord */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Pages principales */}
            <Route path="/directives" element={<DirectivesDocs />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/directives-acces" element={<DirectivesAcces />} />
            
            {/* Pages de rédaction et questionnaire */}
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/avis-general" element={<AvisGeneral />} />
            <Route path="/maintien-vie" element={<MaintienVie />} />
            <Route path="/maladie-avancee" element={<MaladieAvancee />} />
            <Route path="/gouts-peurs" element={<GoutsPeurs />} />
            <Route path="/personne-confiance" element={<PersonneConfiance />} />
            <Route path="/exemples-phrases" element={<ExemplesPhrases />} />
            <Route path="/synthese" element={<Synthesis />} />
            
            {/* Pages d'accès */}
            <Route path="/acces-directives" element={<DirectivesAccess />} />
            <Route path="/acces-medical" element={<MedicalAccess />} />
            <Route path="/acces-documents" element={<AccessDocuments />} />
            <Route path="/acces-institution" element={<InstitutionAccess />} />
            <Route path="/institution-access" element={<InstitutionAccess />} />
            <Route path="/institution-access-simple" element={<InstitutionAccessSimple />} />
            
            {/* Pages médicales */}
            <Route path="/donnees-medicales" element={<MedicalData />} />
            <Route path="/medical-data" element={<MedicalData />} />
            
            {/* Codes d'accès et cartes */}
            <Route path="/codes-acces" element={<AccessCode />} />
            <Route path="/carte-acces" element={<AccessCard />} />
            
            {/* Administration */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Pages d'information */}
            <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/commentaires" element={<Comments />} />
            <Route path="/temoignages" element={<Testimonials />} />
            
            {/* Pages utilitaires */}
            <Route path="/signaler-violation" element={<ReportDataBreach />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/acces-institution-old" element={<AccesInstitution />} />
            <Route path="/affichage-dossier" element={<AffichageDossierRedirect />} />
            
            {/* Routes dynamiques */}
            <Route path="/partage/:shareCode" element={<Partage />} />
            <Route path="/:pageId" element={<PlaceholderPage />} />
            
            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

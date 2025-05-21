
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Rediger from "@/pages/Rediger";
import Profile from "@/pages/Profile";
import Synthesis from "@/pages/Synthesis";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import PlaceholderPage from "@/pages/PlaceholderPage";
import DirectivesDocs from "@/pages/DirectivesDocs";
import MedicalData from "@/pages/MedicalData";
import AccessDocuments from "@/pages/AccessDocuments";
import DirectivesAccess from "@/pages/DirectivesAccess";
import MedicalAccess from "@/pages/MedicalAccess";
import AvisGeneral from "@/pages/AvisGeneral";
import MaintienVie from "@/pages/MaintienVie";
import MaladieAvancee from "@/pages/MaladieAvancee";
import GoutsPeurs from "@/pages/GoutsPeurs";
import ExemplesPhrases from "@/pages/ExemplesPhrases";
import PersonneConfiance from "@/pages/PersonneConfiance";
import AccessCardPage from "./pages/AccessCard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataProtectionImpact from "./pages/DataProtectionImpact";
import BackupPolicy from "./pages/BackupPolicy";
import DataBreachProcedure from "./pages/DataBreachProcedure";
import ReportDataBreach from "./pages/ReportDataBreach";
import Comments from "./pages/Comments";
import LegalMentions from "./pages/LegalMentions";
import Soutenir from "./pages/Soutenir";
import CookieBanner from "./components/CookieBanner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AffichageDossier from "./pages/AffichageDossier";
import DirectivesViewer from "./pages/DirectivesViewer";
import MedicalViewer from "./pages/MedicalViewer";

import "./App.css";

// Create the router outside of the component to avoid recreation on each render
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/auth", element: <Auth /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/rediger", element: <Rediger /> },
  { path: "/synthesis", element: <Synthesis /> },
  { path: "/profile", element: <Profile /> },
  { path: "/mes-directives", element: <DirectivesDocs /> },
  { path: "/donnees-medicales", element: <MedicalData /> },
  { path: "/acces-document", element: <AccessDocuments /> },
  { path: "/acces-directives", element: <DirectivesAccess /> },
  { path: "/acces-medical", element: <MedicalAccess /> },
  { path: "/admin", element: <Admin /> },
  { path: "/politique-confidentialite", element: <PrivacyPolicy /> },
  { path: "/analyse-impact-protection-donnees", element: <DataProtectionImpact /> },
  { path: "/politique-sauvegarde", element: <BackupPolicy /> },
  { path: "/procedure-violation-donnees", element: <DataBreachProcedure /> },
  { path: "/signaler-violation", element: <ReportDataBreach /> },
  { path: "/commentaires", element: <Comments /> },
  { path: "/mentions-legales", element: <LegalMentions /> },
  { path: "/soutenir", element: <Soutenir /> },
  { path: "/avis-general", element: <AvisGeneral /> },
  { path: "/maintien-vie", element: <MaintienVie /> },
  { path: "/maladie-avancee", element: <MaladieAvancee /> },
  { path: "/gouts-peurs", element: <GoutsPeurs /> },
  { path: "/exemples-phrases", element: <ExemplesPhrases /> },
  { path: "/personne-confiance", element: <PersonneConfiance /> },
  { path: "/synthese", element: <Synthesis /> },
  { path: "/carte-acces", element: <AccessCardPage /> },
  { path: "/affichage-dossier", element: <AffichageDossier /> },
  // Nouvelles routes pour visualiser les documents
  { path: "/directives-viewer/:dossierId", element: <DirectivesViewer /> },
  { path: "/medical-viewer/:dossierId", element: <MedicalViewer /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <CookieBanner />
      <Toaster />
    </AuthProvider>
  );
};

export default App;

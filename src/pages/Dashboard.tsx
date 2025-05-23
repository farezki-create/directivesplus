import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DossierContentProvider from "@/components/dossier/DossierContentProvider";
import { useDossierStore } from "@/store/dossierStore";
import { getAuthUserDossier } from "@/api/access/accessCodeVerification";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import DashboardHeader from "@/components/dossier/DashboardHeader";
import DashboardNavigation from "@/components/dossier/DashboardNavigation";
import DashboardEmptyState from "@/components/dossier/DashboardEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Home } from "lucide-react";
import DirectivesGrid from "@/components/DirectivesGrid";
const Dashboard = () => {
  const {
    user,
    isAuthenticated,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const dossierActif = useDossierStore(state => state.dossierActif);
  const setDossierActif = useDossierStore(state => state.setDossierActif);
  const decryptedContent = useDossierStore(state => state.decryptedContent);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Auto-load user dossier if authenticated but no active dossier
    if (isAuthenticated && user && !dossierActif) {
      loadUserDossier();
    }
  }, [isAuthenticated, isLoading, user, dossierActif, navigate]);
  const loadUserDossier = async () => {
    if (!user) return;
    try {
      const result = await getAuthUserDossier(user.id, "directive");
      if (result.success && result.dossier) {
        setDossierActif(result.dossier);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du dossier:", error);
    }
  };
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <DossierContentProvider>
      
    </DossierContentProvider>;
};
export default Dashboard;
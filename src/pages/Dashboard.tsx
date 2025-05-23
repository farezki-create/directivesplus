
import React from "react";
import DossierContentProvider from "@/components/dossier/DossierContentProvider";
import { useDossierStore } from "@/store/dossierStore";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import DashboardHeader from "@/components/dossier/DashboardHeader";
import DashboardNavigation from "@/components/dossier/DashboardNavigation";
import DashboardEmptyState from "@/components/dossier/DashboardEmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Home } from "lucide-react";
import DirectivesGrid from "@/components/DirectivesGrid";

const Dashboard = () => {
  const dossierActif = useDossierStore((state) => state.dossierActif);
  const decryptedContent = useDossierStore((state) => state.decryptedContent);
  
  return (
    <DossierContentProvider>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        
        <DashboardNavigation />
        
        {dossierActif ? (
          <>
            <DashboardHeader />
            
            <Tabs defaultValue="home" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="home" className="flex items-center gap-2">
                  <Home size={16} />
                  Accueil
                </TabsTrigger>
                <TabsTrigger value="directives" className="flex items-center gap-2">
                  <FileText size={16} />
                  Directives
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="home">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-xl font-semibold mb-4">Bienvenue sur votre tableau de bord</h2>
                  <p className="text-gray-600 mb-6">
                    Accédez facilement à vos directives et documents depuis cette interface.
                  </p>
                  <DirectivesGrid />
                </div>
              </TabsContent>
              
              <TabsContent value="directives">
                <DirectivesTab />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <DashboardEmptyState />
        )}
      </div>
    </DossierContentProvider>
  );
};

export default Dashboard;

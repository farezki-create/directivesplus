import React from "react";
import DossierContentProvider from "@/components/dossier/DossierContentProvider";
import { useDossierStore } from "@/store/dossierStore";
import DirectivesTab from "@/components/dossier/DirectivesTab";

const Dashboard = () => {
  const dossierActif = useDossierStore((state) => state.dossierActif);
  
  return (
    <DossierContentProvider>
      {/* Wrap DirectivesTab and other components that need decrypted content */}
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
        
        {dossierActif && (
          <div className="mt-6">
            <DirectivesTab />
          </div>
        )}
      </div>
    </DossierContentProvider>
  );
};

export default Dashboard;

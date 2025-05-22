
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DirectivesTab from "@/components/dossier/DirectivesTab";
import MedicalDataTab from "@/components/dossier/MedicalDataTab";
import { toast } from "@/hooks/use-toast";

interface DossierTabContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  canAccessDirectives: boolean;
  canAccessMedical: boolean;
  decryptedContent: any;
  decryptionError?: string | null;
  hasDirectives: boolean;
  getDirectives: () => any;
  resetActivityTimer: () => void;
  logDossierEvent: (event: string, success: boolean) => void;
}

const DossierTabContent: React.FC<DossierTabContentProps> = ({
  activeTab,
  setActiveTab,
  canAccessDirectives,
  canAccessMedical,
  decryptedContent,
  decryptionError,
  hasDirectives,
  getDirectives,
  resetActivityTimer,
  logDossierEvent
}) => {
  // Event handler for tab change
  const handleTabChange = (value: string) => {
    // Vérifier si l'utilisateur a accès à cet onglet
    if (value === "medical" && !canAccessMedical) {
      console.log("Tentative d'accès aux données médicales refusée");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès aux données médicales avec ce code",
        variant: "destructive"
      });
      return;
    }
    
    if (value === "directives" && !canAccessDirectives) {
      console.log("Tentative d'accès aux directives refusée");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas accès aux directives anticipées avec ce code",
        variant: "destructive"
      });
      return;
    }
    
    resetActivityTimer();
    setActiveTab(value);
    
    // Log tab change event
    logDossierEvent(`switch_to_${value}`, true);
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="px-6 py-2 border-b">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger 
            value="directives"
            disabled={!canAccessDirectives}
            className={!canAccessDirectives ? "opacity-50 cursor-not-allowed" : ""}
          >
            Directives Anticipées
          </TabsTrigger>
          <TabsTrigger 
            value="medical"
            disabled={!canAccessMedical}
            className={!canAccessMedical ? "opacity-50 cursor-not-allowed" : ""}
          >
            Données Médicales
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="directives" className="p-0">
        <DirectivesTab 
          decryptedContent={decryptedContent}
          hasDirectives={hasDirectives}
          getDirectives={getDirectives}
          decryptionError={decryptionError}
        />
      </TabsContent>
      
      <TabsContent value="medical" className="p-0">
        <MedicalDataTab 
          decryptedContent={decryptedContent}
          decryptionError={decryptionError}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DossierTabContent;

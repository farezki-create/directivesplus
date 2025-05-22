
import React from "react";
import { Card } from "@/components/ui/card";
import DossierHeader from "@/components/dossier/DossierHeader";
import DossierTabContent from "@/components/dossier/DossierTabContent";
import DossierFooter from "@/components/dossier/DossierFooter";

interface DossierContentViewProps {
  patientInfo: any;
  decryptedContent: any;
  decryptionError: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canAccessDirectives: boolean;
  canAccessMedical: boolean;
  hasDirectives: boolean;
  getDirectives: () => any;
  resetActivityTimer: () => void;
  logDossierEvent: (event: string, success: boolean) => void;
  handleSecurityClose: () => void;
}

const DossierContentView: React.FC<DossierContentViewProps> = ({
  patientInfo,
  decryptedContent,
  decryptionError,
  activeTab,
  setActiveTab,
  canAccessDirectives,
  canAccessMedical,
  hasDirectives,
  getDirectives,
  resetActivityTimer,
  logDossierEvent,
  handleSecurityClose
}) => {
  return (
    <div className="container max-w-4xl py-8" onClick={resetActivityTimer}>
      <Card className="shadow-lg">
        <DossierHeader 
          onClose={handleSecurityClose}
          patientInfo={patientInfo}
        />
        
        <DossierTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canAccessDirectives={canAccessDirectives}
          canAccessMedical={canAccessMedical}
          decryptedContent={decryptedContent}
          decryptionError={decryptionError}
          hasDirectives={hasDirectives}
          getDirectives={getDirectives}
          resetActivityTimer={resetActivityTimer}
          logDossierEvent={logDossierEvent}
        />
        
        <DossierFooter />
      </Card>
    </div>
  );
};

export default DossierContentView;

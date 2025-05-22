
import React, { useState } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import DirectAccessCodeHandler from "@/components/dossier/DirectAccessCodeHandler";
import InitialDossierCheck from "@/components/dossier/InitialDossierCheck";
import DossierMain from "@/components/dossier/DossierMain";
import { useDocumentProcessing } from "@/hooks/useDocumentProcessing";

const AffichageDossier: React.FC = () => {
  const { dossierActif, setDossierActif } = useDossierStore();
  
  const { 
    patientInfo, 
    decryptedContent, 
    decryptionError,
    loading, 
    activeTab, 
    setActiveTab,
    hasDirectives,
    getDirectives,
    canAccessDirectives,
    canAccessMedical,
    handleCloseDossier
  } = useDossierSession();
  
  const { 
    resetActivityTimer, 
    logDossierEvent, 
    handleSecurityClose,
    startSecurityMonitoring,
    stopSecurityMonitoring
  } = useDossierSecurity();
  
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Use the document processing hook to manage document state
  const { documentLoadError } = useDocumentProcessing(
    dossierActif,
    decryptedContent,
    loading,
    hasDirectives,
    setDossierActif,
    logDossierEvent
  );
  
  return (
    <>
      <DirectAccessCodeHandler 
        logDossierEvent={logDossierEvent} 
        setInitialLoading={setInitialLoading}
      />
      
      <InitialDossierCheck
        dossierActif={dossierActif}
        loading={loading}
        initialLoading={initialLoading}
        loadAttempts={loadAttempts}
        setLoadAttempts={setLoadAttempts}
        logDossierEvent={logDossierEvent}
        startSecurityMonitoring={startSecurityMonitoring}
        stopSecurityMonitoring={stopSecurityMonitoring}
      />
      
      <DossierMain
        dossierActif={dossierActif}
        loading={loading}
        initialLoading={initialLoading}
        decryptedContent={decryptedContent}
        decryptionError={decryptionError}
        documentLoadError={documentLoadError}
        patientInfo={patientInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        canAccessDirectives={canAccessDirectives}
        canAccessMedical={canAccessMedical}
        hasDirectives={hasDirectives}
        getDirectives={getDirectives}
        resetActivityTimer={resetActivityTimer}
        logDossierEvent={logDossierEvent}
        handleSecurityClose={handleSecurityClose}
      />
    </>
  );
};

export default AffichageDossier;

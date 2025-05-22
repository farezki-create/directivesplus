
import React, { useState } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/security/useDossierSecurity";
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
  
  // Handlers for the check components
  const handleComplete = () => {
    setInitialLoading(false);
  };
  
  const handleError = (message: string) => {
    console.error("Dossier error:", message);
    setInitialLoading(false);
  };
  
  return (
    <>
      <DirectAccessCodeHandler 
        onLoad={(data) => {
          console.log("Direct access document loaded:", data);
          setInitialLoading(false);
        }}
        logDossierEvent={logDossierEvent}
        setInitialLoading={setInitialLoading}
      />
      
      <InitialDossierCheck
        onComplete={handleComplete}
        onError={handleError}
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

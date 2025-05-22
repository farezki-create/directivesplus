
import React, { useState } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import DossierLoadingState from "@/components/dossier/DossierLoadingState";
import DossierContentView from "@/components/dossier/DossierContentView";
import DossierNoDataError from "@/components/dossier/DossierNoDataError";
import DirectAccessCodeHandler from "@/components/dossier/DirectAccessCodeHandler";
import InitialDossierCheck from "@/components/dossier/InitialDossierCheck";

const AffichageDossier: React.FC = () => {
  const { dossierActif } = useDossierStore();
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
  
  // Gérer le code d'accès direct (dans un composant séparé)
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
      
      {/* État de chargement */}
      {(loading || initialLoading) ? (
        <DossierLoadingState />
      ) : (
        <>
          {/* Gestion des erreurs */}
          <DossierNoDataError
            dossierActif={dossierActif}
            decryptedContent={decryptedContent}
            decryptionError={decryptionError}
            loading={loading}
          />
          
          {/* Contenu principal (affiché uniquement si nous avons du contenu) */}
          {dossierActif && decryptedContent && (
            <DossierContentView
              patientInfo={patientInfo}
              decryptedContent={decryptedContent}
              decryptionError={decryptionError}
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
          )}
        </>
      )}
    </>
  );
};

export default AffichageDossier;

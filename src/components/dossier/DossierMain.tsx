
import React from "react";
import DossierLoadingState from "@/components/dossier/DossierLoadingState";
import DossierContentView from "@/components/dossier/DossierContentView";
import DossierNoDataError from "@/components/dossier/DossierNoDataError";
import DocumentLoadErrorAlert from "@/components/dossier/DocumentLoadErrorAlert";
import { useAuth } from "@/contexts/AuthContext";

interface DossierMainProps {
  dossierActif: any;
  loading: boolean;
  initialLoading: boolean;
  decryptedContent: any;
  decryptionError: string | null;
  documentLoadError: string | null;
  patientInfo: any;
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

const DossierMain: React.FC<DossierMainProps> = ({
  dossierActif,
  loading,
  initialLoading,
  decryptedContent,
  decryptionError,
  documentLoadError,
  patientInfo,
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
  const { user, isAuthenticated } = useAuth();
  
  return (
    <>
      {/* Document load error */}
      <DocumentLoadErrorAlert 
        errorMessage={documentLoadError} 
        isAuthenticated={isAuthenticated}
        user={user}
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
          {dossierActif && (
            decryptedContent || 
            dossierActif.contenu?.document_url || 
            (dossierActif.contenu?.documents && dossierActif.contenu.documents.length > 0)
          ) && (
            <DossierContentView
              patientInfo={patientInfo}
              decryptedContent={decryptedContent || { 
                document_url: dossierActif.contenu.document_url,
                documents: dossierActif.contenu.documents
              }}
              decryptionError={decryptionError}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              canAccessDirectives={canAccessDirectives}
              canAccessMedical={canAccessMedical}
              hasDirectives={hasDirectives || 
                !!dossierActif.contenu?.document_url || 
                !!(dossierActif.contenu?.documents && dossierActif.contenu.documents.length > 0)}
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

export default DossierMain;

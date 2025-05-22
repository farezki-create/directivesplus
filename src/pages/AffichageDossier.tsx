
import React, { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { useDossierSession } from "@/hooks/useDossierSession";
import { useDossierSecurity } from "@/hooks/useDossierSecurity";
import DossierLoadingState from "@/components/dossier/DossierLoadingState";
import DossierContentView from "@/components/dossier/DossierContentView";
import DossierNoDataError from "@/components/dossier/DossierNoDataError";
import DirectAccessCodeHandler from "@/components/dossier/DirectAccessCodeHandler";
import InitialDossierCheck from "@/components/dossier/InitialDossierCheck";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AffichageDossier: React.FC = () => {
  const { dossierActif, setDossierActif } = useDossierStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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
  const [documentLoadError, setDocumentLoadError] = useState<string | null>(null);
  
  // Log detailed information about the dossier state for debugging
  useEffect(() => {
    if (dossierActif) {
      console.log("AffichageDossier - dossierActif état:", { 
        id: dossierActif.id,
        hasDocumentUrl: !!dossierActif.contenu?.document_url,
        documentUrl: dossierActif.contenu?.document_url,
        decryptedContentAvailable: !!decryptedContent,
        loading
      });
    } else {
      console.log("AffichageDossier - Aucun dossier actif");
    }
  }, [dossierActif, decryptedContent, loading]);
  
  // Check for document-related errors when the dossier content changes
  useEffect(() => {
    if (dossierActif && !loading) {
      // Vérifier si l'URL du document existe dans le dossier
      if (dossierActif.contenu?.document_url) {
        console.log("URL du document détectée dans le dossier:", dossierActif.contenu.document_url);
        
        // Si le contenu déchiffré n'inclut pas l'URL du document, l'ajouter manuellement
        if (decryptedContent && !decryptedContent.document_url) {
          console.log("Ajout manuel de l'URL du document au contenu déchiffré");
          const updatedContent = {
            ...decryptedContent,
            document_url: dossierActif.contenu.document_url
          };
          
          // Force update of dossier actif to ensure document URL is present
          setDossierActif({
            ...dossierActif,
            contenu: {
              ...dossierActif.contenu,
              document_url: dossierActif.contenu.document_url
            }
          });
          
          // Log status for debugging
          console.log("Mise à jour du contenu déchiffré avec l'URL du document:", updatedContent);
        }
      } else if (!dossierActif.contenu?.document_url && !hasDirectives) {
        console.log("Aucune URL de document ou directive trouvée dans le dossier");
        setDocumentLoadError("Le document n'a pas pu être chargé correctement. Veuillez réessayer.");
        logDossierEvent("document_load_failure", false);
      } else {
        setDocumentLoadError(null);
      }
    }
  }, [dossierActif, decryptedContent, loading, hasDirectives]);
  
  // Handler for retrying document load
  const handleRetryDocumentLoad = () => {
    if (isAuthenticated && user) {
      toast({
        title: "Nouvelle tentative",
        description: "Tentative de rechargement du document..."
      });
      
      // Reset error state
      setDocumentLoadError(null);
      
      // Force a reload of the current page to restart the flow
      window.location.reload();
    } else {
      // For non-authenticated users, just navigate back
      navigate('/mes-directives');
    }
  };
  
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
      
      {/* Document load error */}
      {documentLoadError && (
        <div className="container max-w-3xl py-4">
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement du document</AlertTitle>
            <AlertDescription>
              {documentLoadError}
              <div className="mt-2">
                <button 
                  onClick={handleRetryDocumentLoad}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
                >
                  Réessayer
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
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
          {dossierActif && (decryptedContent || dossierActif.contenu?.document_url) && (
            <DossierContentView
              patientInfo={patientInfo}
              decryptedContent={decryptedContent || { document_url: dossierActif.contenu.document_url }}
              decryptionError={decryptionError}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              canAccessDirectives={canAccessDirectives}
              canAccessMedical={canAccessMedical}
              hasDirectives={hasDirectives || !!dossierActif.contenu?.document_url}
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

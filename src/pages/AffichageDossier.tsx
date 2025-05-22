
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
import { Button } from "@/components/ui/button";

const AffichageDossier: React.FC = () => {
  const { dossierActif } = useDossierStore();
  const { user } = useAuth();
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
  const [directDocumentDisplay, setDirectDocumentDisplay] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  
  // Log dossier content for debugging
  useEffect(() => {
    // Si le dossierActif est présent, vérifier le document_url
    if (dossierActif) {
      console.log("[AffichageDossier] dossierActif:", {
        id: dossierActif.id,
        contenu: dossierActif.contenu ? "présent" : "absent",
        document_url: dossierActif.contenu?.document_url || "aucun",
      });
      
      // Chercher le document_url dans différents endroits possibles
      let url = null;
      
      // 1. Directement dans contenu.document_url
      if (dossierActif.contenu?.document_url) {
        url = dossierActif.contenu.document_url;
        console.log("[AffichageDossier] URL trouvée dans contenu.document_url:", url);
      } 
      // 2. Dans le contenu déchiffré s'il existe
      else if (decryptedContent?.document_url) {
        url = decryptedContent.document_url;
        console.log("[AffichageDossier] URL trouvée dans decryptedContent:", url);
      }
      
      if (url) {
        setDocumentUrl(url);
        setDirectDocumentDisplay(true);
        console.log("[AffichageDossier] Document à afficher directement:", url);
      }
    }
  }, [dossierActif, decryptedContent]);
  
  // Direct document display component - SIMPLIFIED VERSION
  const DirectDocumentDisplay = () => {
    if (!documentUrl) return null;
    
    console.log("[AffichageDossier] Affichage direct du document:", documentUrl);
    
    return (
      <div className="container max-w-3xl py-8">
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertTitle>Document en affichage direct</AlertTitle>
          <AlertDescription>
            Ce document a été partagé directement depuis votre espace personnel.
          </AlertDescription>
        </Alert>
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={documentUrl}
            className="w-full h-[70vh]"
            title="Document partagé"
            onError={(e) => {
              console.error("Erreur de chargement du document:", e);
              setDocumentLoadError("Le document n'a pas pu être chargé correctement.");
            }}
          />
        </div>
      </div>
    );
  };
  
  // Handler for retrying document load
  const handleRetryDocumentLoad = () => {
    if (documentUrl) {
      toast({
        title: "Nouvelle tentative",
        description: "Tentative de rechargement du document..."
      });
      
      // Reset error state
      setDocumentLoadError(null);
      
      // Force reload
      setDirectDocumentDisplay(false);
      setTimeout(() => {
        setDirectDocumentDisplay(true);
      }, 500);
      
      return;
    } else {
      navigate('/mes-directives');
    }
  };
  
  // S'assurer que le document est bien transféré du dossier vers le contenu déchiffré
  useEffect(() => {
    if (dossierActif && dossierActif.contenu?.document_url) {
      console.log("[AffichageDossier] Document URL trouvé dans dossier:", dossierActif.contenu.document_url);
      setDocumentUrl(dossierActif.contenu.document_url);
      setDirectDocumentDisplay(true);
      
      // Si nous avons un decryptedContent, synchroniser aussi là-bas
      if (decryptedContent) {
        console.log("[AffichageDossier] Synchronisation avec decryptedContent");
        decryptedContent.document_url = dossierActif.contenu.document_url;
      }
    }
  }, [dossierActif, decryptedContent]);
  
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
                <Button 
                  onClick={handleRetryDocumentLoad}
                  className="text-white bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
                >
                  Réessayer
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Direct document display - priorité absolue */}
      {directDocumentDisplay && documentUrl && !documentLoadError && (
        <DirectDocumentDisplay />
      )}
      
      {/* État de chargement */}
      {(loading || initialLoading) && !directDocumentDisplay && (
        <DossierLoadingState />
      )}
      
      {/* Contenu normal du dossier - affiché uniquement si nous n'avons pas d'affichage direct */}
      {!directDocumentDisplay && !loading && !initialLoading && (
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

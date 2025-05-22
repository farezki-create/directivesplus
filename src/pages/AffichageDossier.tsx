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
  const { dossierActif } = useDossierStore();
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
  const [directDocumentDisplay, setDirectDocumentDisplay] = useState(false);
  
  // Log dossier content for debugging
  useEffect(() => {
    if (dossierActif) {
      console.log("[AffichageDossier] dossierActif:", {
        id: dossierActif.id,
        contenu: dossierActif.contenu ? "présent" : "absent",
        document_url: dossierActif.contenu?.document_url || "aucun",
      });
      
      // Check if this is a direct document display case
      if (dossierActif.contenu?.document_url) {
        // Either simple dossier with just document_url or minimal fields
        if (!dossierActif.contenu.patient || 
            Object.keys(dossierActif.contenu).length <= 3) {
          console.log("[AffichageDossier] Document direct ultra simple détecté:", dossierActif.contenu.document_url);
          setDirectDocumentDisplay(true);
        }
      }
    }
    
    // Also check if we have a decryptedContent with document_url but it's not in dossierActif
    if (decryptedContent?.document_url && dossierActif?.contenu && !dossierActif.contenu.document_url) {
      console.log("[AffichageDossier] Transfert du document du contenu déchiffré vers le dossier");
      dossierActif.contenu.document_url = decryptedContent.document_url;
      dossierActif.contenu.document_name = decryptedContent.document_name || 
                                          decryptedContent.document_url.split('/').pop() || 
                                          "document";
    }
  }, [dossierActif, decryptedContent]);
  
  // Direct document display component - SIMPLIFIED VERSION
  const DirectDocumentDisplay = () => {
    if (!dossierActif?.contenu?.document_url) return null;
    
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
            src={dossierActif.contenu.document_url}
            className="w-full h-[70vh]"
            title="Document partagé"
          />
        </div>
      </div>
    );
  };
  
  // Handler for retrying document load
  const handleRetryDocumentLoad = () => {
    if (dossierActif?.contenu?.document_url) {
      toast({
        title: "Nouvelle tentative",
        description: "Tentative de rechargement du document..."
      });
      
      // Reset error state
      setDocumentLoadError(null);
      
      if (directDocumentDisplay) {
        // Force a re-render for direct document display
        setDirectDocumentDisplay(false);
        setTimeout(() => setDirectDocumentDisplay(true), 100);
        return;
      }
      
      // Reload the page as a last resort
      window.location.reload();
    } else {
      navigate('/mes-directives');
    }
  };
  
  // Afficher le contenu du dossier pour le débogage
  useEffect(() => {
    if (dossierActif) {
      console.log("AffichageDossier - dossierActif:", {
        id: dossierActif.id,
        contenu: dossierActif.contenu ? "présent" : "absent",
        document_url: dossierActif.contenu?.document_url || "aucun",
        hasContentKeys: dossierActif.contenu ? Object.keys(dossierActif.contenu) : []
      });
    }
    
    if (decryptedContent) {
      console.log("AffichageDossier - decryptedContent:", {
        document_url: decryptedContent.document_url || "aucun",
        hasKeys: Object.keys(decryptedContent)
      });
    }
  }, [dossierActif, decryptedContent]);
  
  // S'assurer que le document est bien transféré du dossier vers le contenu déchiffré
  useEffect(() => {
    if (dossierActif && decryptedContent && 
        dossierActif.contenu?.document_url && 
        !decryptedContent.document_url) {
      
      console.log("Transfert manuel du document du dossier au contenu déchiffré:", 
                  dossierActif.contenu.document_url);
                  
      // On ajoute manuellement le document au contenu déchiffré
      decryptedContent.document_url = dossierActif.contenu.document_url;
      decryptedContent.document_name = dossierActif.contenu.document_name || 
                                      dossierActif.contenu.document_url.split('/').pop() || 
                                      "document";
    }
  }, [dossierActif, decryptedContent]);
  
  // Check for document-related errors when the dossier content changes
  useEffect(() => {
    if (dossierActif && !loading) {
      if (dossierActif.contenu?.document_url && (!decryptedContent || !decryptedContent.document_url)) {
        console.log("Document URL exists in dossier but not in decrypted content:", dossierActif.contenu.document_url);
        setDocumentLoadError("Le document n'a pas pu être chargé correctement. Veuillez réessayer.");
        
        // Log the event for troubleshooting
        logDossierEvent("document_load_failure", false);
      } else {
        setDocumentLoadError(null);
      }
    }
  }, [dossierActif, decryptedContent, loading, logDossierEvent]);
  
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
      
      {/* Direct document display - SIMPLIFIED version gets priority */}
      {directDocumentDisplay && dossierActif?.contenu?.document_url && !loading && <DirectDocumentDisplay />}
      
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
          {!directDocumentDisplay && (
            <DossierNoDataError
              dossierActif={dossierActif}
              decryptedContent={decryptedContent}
              decryptionError={decryptionError}
              loading={loading}
            />
          )}
          
          {/* Contenu principal (affiché uniquement si nous avons du contenu) */}
          {!directDocumentDisplay && dossierActif && decryptedContent && (
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

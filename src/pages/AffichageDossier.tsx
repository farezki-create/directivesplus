
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
  
  // Handler for retrying document load
  const handleRetryDocumentLoad = () => {
    if (dossierActif?.contenu?.document_url) {
      toast({
        title: "Nouvelle tentative",
        description: "Tentative de rechargement du document..."
      });
      
      // Reset error state
      setDocumentLoadError(null);
      
      // Pour les utilisateurs authentifiés, on tente de forcer le rechargement du document
      if (isAuthenticated && user && dossierActif.contenu.document_url) {
        console.log("Tentative de rechargement manuel du document pour utilisateur authentifié");
        
        // Copier le document URL directement dans le contenu déchiffré si possible
        if (decryptedContent && dossierActif.contenu.document_url) {
          decryptedContent.document_url = dossierActif.contenu.document_url;
          console.log("Document URL ajouté manuellement au contenu déchiffré");
          
          // Forcer un re-render
          setActiveTab(activeTab === "medical" ? "directives" : "medical");
          setTimeout(() => setActiveTab(activeTab), 100);
          
          toast({
            title: "Document rechargé",
            description: "Le document a été rechargé manuellement"
          });
          return;
        }
      }
      
      // Sinon, on tente un simple rechargement de la page
      window.location.reload();
    } else {
      // Pour les cas où il n'y a pas de document dans le dossier
      navigate('/mes-directives');
    }
  };
  
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
      
      {/* Document direct display if dossier contains document_url but no other content */}
      {dossierActif && dossierActif.contenu?.document_url && !loading && !initialLoading &&
       Object.keys(dossierActif.contenu).length === 2 && dossierActif.contenu.patient && (
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
      )}
      
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


import { useDirectivesDocuments } from "@/hooks/useDirectivesDocuments";
import { useAuth } from "@/contexts/AuthContext";
import { usePublicDirectivesAccess } from "@/hooks/usePublicDirectivesAccess";

import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import PublicDirectivesView from "@/components/directives/PublicDirectivesView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { Document } from "@/types/documents";

const DirectivesDocs = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth();
  const { clearDossierActif } = useDossierStore();
  
  // Clear any existing dossier data on component mount to force fresh access
  useEffect(() => {
    clearDossierActif();
  }, [clearDossierActif]);
  
  const { 
    publicAccessVerified, 
    publicAccessLoading, 
    dossierActif, 
    handlePublicAccess,
    urlParams,
    institutionAccess
  } = usePublicDirectivesAccess(isAuthenticated);
  
  // État local pour les options d'ajout dans la vue publique
  const [showAddOptionsPublic, setShowAddOptionsPublic] = useState(false);
  
  // Local state for preview document
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  
  console.log("DirectivesDocs - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated, isLoading: authLoading });
  console.log("DirectivesDocs - Dossier actif:", dossierActif);
  console.log("DirectivesDocs - URL params:", urlParams);
  console.log("DirectivesDocs - Institution access:", institutionAccess);
  
  const {
    isLoading: documentsLoading,
    documents,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    handleUploadComplete,
  } = useDirectivesDocuments();

  // Gérer l'affichage du toast pour document ajouté
  useEffect(() => {
    const documentAdded = sessionStorage.getItem('documentAdded');
    
    if (documentAdded && dossierActif) {
      try {
        const addedDocInfo = JSON.parse(documentAdded);
        console.log("Document détecté comme ajouté:", addedDocInfo);
        
        // Nettoyer le sessionStorage
        sessionStorage.removeItem('documentAdded');
        
        // Afficher un toast de confirmation
        toast({
          title: "Document ajouté avec succès",
          description: `${addedDocInfo.fileName} est maintenant accessible dans vos directives`,
        });
      } catch (error) {
        console.error("Erreur lors du traitement du document ajouté:", error);
      }
    }
  }, [dossierActif]);

  const isLoading = authLoading || documentsLoading || publicAccessLoading;

  // Wrapper function to handle upload completion
  const handleUploadCompleteWrapper = () => {
    // For this context, we don't have the specific parameters,
    // so we'll call refresh documents directly
    window.location.reload();
  };

  // Preview handlers
  const handlePreviewDownload = (filePath: string, fileName: string) => {
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string, fileType?: string) => {
    handlePrint(filePath, fileType);
  };

  // Si l'utilisateur est en train de se connecter, afficher un état de chargement
  if (isLoading) {
    return <DirectivesLoadingState />;
  }

  // Afficher l'erreur d'accès par institution si présente
  if (urlParams.hasAllParams && institutionAccess.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {institutionAccess.error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, afficher directement ses documents
  if (isAuthenticated && user) {
    return (
      <AuthenticatedDirectivesView
        user={user}
        profile={profile}
        documents={documents}
        showAddOptions={showAddOptions}
        setShowAddOptions={setShowAddOptions}
        onUploadComplete={handleUploadCompleteWrapper}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleView}
        documentToDelete={documentToDelete}
        setDocumentToDelete={setDocumentToDelete}
        handleDelete={handleDelete}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
      />
    );
  }

  // Pour les utilisateurs non authentifiés avec accès public vérifié OU avec un dossier dans le store
  if (!isAuthenticated && (publicAccessVerified || dossierActif)) {
    // Déterminer les documents à afficher
    let documentsToDisplay = documents;
    
    // Si nous avons un dossier actif, utiliser ses documents
    if (dossierActif?.contenu?.documents) {
      documentsToDisplay = dossierActif.contenu.documents.map((doc: any, index: number) => ({
        id: doc.id || `doc-${index}`,
        file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
        file_path: doc.file_path || doc.filePath || '',
        file_type: doc.file_type || doc.fileType || 'pdf',
        content_type: doc.content_type || doc.contentType,
        user_id: doc.user_id || doc.userId || '',
        created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
        description: doc.description,
        content: doc.content,
        file_size: doc.file_size || doc.fileSize,
        updated_at: doc.updated_at || doc.updatedAt,
        external_id: doc.external_id || doc.externalId
      }));
    }

    console.log("Documents à afficher:", documentsToDisplay);

    return (
      <PublicDirectivesView
        dossierActif={dossierActif}
        profile={profile}
        documents={documentsToDisplay}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleView}
        previewDocument={previewDocument?.file_path || null}
        setPreviewDocument={(filePath: string | null) => {
          if (filePath) {
            const doc = documentsToDisplay.find(d => d.file_path === filePath);
            setPreviewDocument(doc || null);
          } else {
            setPreviewDocument(null);
          }
        }}
        handlePreviewDownload={(filePath: string) => {
          const doc = documentsToDisplay.find(d => d.file_path === filePath);
          const fileName = doc?.file_name || 'document';
          handleDownload(filePath, fileName);
        }}
        handlePreviewPrint={handlePreviewPrint}
        showAddOptions={showAddOptionsPublic}
        setShowAddOptions={setShowAddOptionsPublic}
        onUploadComplete={handleUploadCompleteWrapper}
      />
    );
  }

  // Redirection vers la page d'accès si l'utilisateur n'est pas authentifié et n'a pas d'accès vérifié
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Accès non autorisé. Veuillez vous authentifier pour accéder aux directives.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default DirectivesDocs;

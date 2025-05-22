import React, { useState } from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { useAuth } from "@/contexts/AuthContext";

interface DirectivesPageContentProps {
  documents: Document[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  userId: string;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  accessCode?: string | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

const DirectivesPageContent: React.FC<DirectivesPageContentProps> = ({
  documents,
  showAddOptions,
  setShowAddOptions,
  userId,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  accessCode,
  profile
}) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const { setDossierActif } = useDossierStore();
  const { user, isAuthenticated } = useAuth();

  // Log component render for debugging
  React.useEffect(() => {
    console.log("[DirectivesPageContent] rendered:", { 
      documentsCount: documents.length, 
      accessCode: accessCode ? "présent" : "absent",
      isAuthenticated
    });
  }, [documents.length, accessCode, isAuthenticated]);

  const handleAddToSharedFolder = async (document: Document) => {
    try {
      setIsAdding(true);
      console.log("[DirectivesPageContent] Document sélectionné pour partage:", document);
      
      // Create an ultra simple dossier structure with just the document URL
      const simpleDossier = {
        id: `direct-${Date.now()}`,
        userId: isAuthenticated ? user?.id || userId : "anonymous",
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: null,
        contenu: {
          document_url: document.file_path,
          document_name: document.file_name
        }
      };
      
      console.log("[DirectivesPageContent] Dossier ultra simple créé:", simpleDossier);
      
      // Store the dossier in global state
      setDossierActif(simpleDossier);
      
      // Store access code for non-authenticated users if available
      if (!isAuthenticated && accessCode) {
        sessionStorage.setItem('directAccessCode', accessCode);
        console.log("[DirectivesPageContent] Code d'accès stocké:", accessCode);
      }
      
      toast({
        title: "Document prêt",
        description: "Redirection vers l'affichage du document..."
      });
      
      // Navigate to the dossier display page
      navigate('/affichage-dossier', { replace: true });
    } catch (error) {
      console.error("[DirectivesPageContent] Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager ce document pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DirectivesPageHeader 
        onAddDocument={() => setShowAddOptions(!showAddOptions)} 
      />

      {showAddOptions && userId && (
        <DirectivesAddDocumentSection 
          userId={userId}
          onUploadComplete={onUploadComplete}
        />
      )}
      
      <DirectivesDocumentList 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        onAddToSharedFolder={handleAddToSharedFolder}
        onVisibilityChange={(id, isPrivate) => {
          console.log("[DirectivesPageContent] Changement de visibilité:", id, isPrivate);
        }}
        isAdding={isAdding}
      />
    </div>
  );
};

export default DirectivesPageContent;

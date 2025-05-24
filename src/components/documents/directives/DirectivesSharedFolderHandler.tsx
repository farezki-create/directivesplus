
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { useAuth } from "@/contexts/AuthContext";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";

interface DirectivesSharedFolderHandlerProps {
  documents: Document[];
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

/**
 * Component that handles adding documents to the shared folder
 */
const DirectivesSharedFolderHandler: React.FC<DirectivesSharedFolderHandlerProps> = ({
  documents,
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

  // Log when this component renders with its props
  useEffect(() => {
    console.log("DirectivesSharedFolderHandler rendered:", { 
      documentsCount: documents.length, 
      hasAccessCode: !!accessCode,
      isAuthenticated
    });
  }, [documents.length, accessCode, isAuthenticated]);

  const handleAddToSharedFolder = async (document: Document) => {
    try {
      console.log("Ajout au dossier partagé - document original:", document);
      setIsAdding(true);

      // Créer un document PDF virtuel à partir du document directive
      const virtualDocument = {
        id: document.id,
        file_name: `Directive_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
        file_path: `data:application/pdf;base64,${btoa('Document directive virtuel')}`, // URL de données fictive
        created_at: document.created_at || new Date().toISOString(),
        description: document.content?.title || "Directive anticipée",
        content_type: "application/pdf",
        is_shared: true,
        user_id: document.user_id || "anonymous",
        // Stocker le contenu original de la directive
        original_directive: document
      };

      console.log("Document virtuel créé:", virtualDocument);

      // Créer un dossier temporaire avec le document
      const profileData = isAuthenticated && user ? {
        first_name: user?.user_metadata?.first_name || profile?.first_name || "Utilisateur",
        last_name: user?.user_metadata?.last_name || profile?.last_name || "Connecté",
        birth_date: user?.user_metadata?.birth_date || profile?.birth_date || null,
      } : {
        first_name: profile?.first_name || "Accès",
        last_name: profile?.last_name || "Public",
        birth_date: profile?.birth_date || null,
      };

      const temporaryDossier = {
        id: `shared-document-${Date.now()}`,
        userId: user?.id || "anonymous",
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: profileData,
        contenu: {
          patient: {
            nom: profileData.last_name,
            prenom: profileData.first_name,
            date_naissance: profileData.birth_date || null,
          },
          documents: [virtualDocument]
        }
      };

      console.log("Dossier temporaire créé:", temporaryDossier);

      // Stocker le dossier dans le store
      setDossierActif(temporaryDossier);

      // Marquer le document comme ajouté dans sessionStorage pour affichage du toast
      sessionStorage.setItem('documentAdded', JSON.stringify({
        fileName: virtualDocument.file_name,
        timestamp: Date.now()
      }));

      // Attendre un moment pour laisser le temps au state de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 500));

      // Rediriger vers /mes-directives
      console.log("Redirection vers /mes-directives avec document:", virtualDocument.file_name);
      navigate('/mes-directives');

      toast({
        title: "Document ajouté",
        description: "Document ajouté au dossier partagé avec succès",
      });

    } catch (error) {
      console.error("Erreur lors de l'ajout au dossier partagé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout au dossier partagé",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <DirectivesDocumentList 
      documents={documents}
      onDownload={onDownload}
      onPrint={onPrint}
      onView={onView}
      onDelete={onDelete}
      onAddToSharedFolder={handleAddToSharedFolder}
      onVisibilityChange={(id, isPrivate) => {
        console.log("DirectivesPageContent - Changement de visibilité:", id, isPrivate);
      }}
      isAdding={isAdding}
    />
  );
};

export default DirectivesSharedFolderHandler;


import React from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import DirectivesSharedFolderHandler from "./DirectivesSharedFolderHandler";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DirectivesPageContainerProps {
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

/**
 * Container component that handles the overall structure of the directives page
 */
const DirectivesPageContainer: React.FC<DirectivesPageContainerProps> = ({
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
  const [showDeleteAllDialog, setShowDeleteAllDialog] = React.useState(false);

  const handleDeleteAllDocuments = async () => {
    if (!userId || documents.length === 0) return;

    try {
      console.log("Suppression de tous les documents pour l'utilisateur:", userId);
      
      // Supprimer tous les documents PDF de l'utilisateur
      const { error } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error("Erreur lors de la suppression des documents:", error);
        throw error;
      }

      toast({
        title: "Documents supprimés",
        description: `${documents.length} document${documents.length > 1 ? 's' : ''} supprimé${documents.length > 1 ? 's' : ''} avec succès`
      });

      // Recharger la page pour actualiser la liste
      window.location.reload();
      
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer tous les documents",
        variant: "destructive"
      });
    } finally {
      setShowDeleteAllDialog(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DirectivesPageHeader 
        onAddDocument={() => setShowAddOptions(!showAddOptions)}
        onDeleteAllDocuments={userId ? () => setShowDeleteAllDialog(true) : undefined}
        documentsCount={documents.length}
      />

      {showAddOptions && userId && (
        <DirectivesAddDocumentSection 
          userId={userId}
          onUploadComplete={onUploadComplete}
        />
      )}
      
      <DirectivesSharedFolderHandler 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        accessCode={accessCode}
        profile={profile}
      />

      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer tous les documents</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer tous vos {documents.length} document{documents.length > 1 ? 's' : ''} ? 
              Cette action est irréversible et supprimera tous les documents associés à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllDocuments}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer tout ({documents.length})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DirectivesPageContainer;

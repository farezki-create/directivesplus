import React from "react";
import { Document } from "@/types/documents";
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
  onUploadComplete: () => void;
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
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAllDocuments = async () => {
    console.log("=== DÉBUT SUPPRESSION DE TOUS LES DOCUMENTS ===");
    console.log("UserId:", userId);
    console.log("Nombre de documents à supprimer:", documents.length);
    console.log("Liste des documents:", documents);

    if (!userId || documents.length === 0) {
      console.log("Aucun utilisateur ou aucun document à supprimer");
      setShowDeleteAllDialog(false);
      return;
    }

    setIsDeleting(true);

    try {
      // Supprimer tous les documents PDF de l'utilisateur
      console.log("Tentative de suppression des documents PDF...");
      const { data: deletedPdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('user_id', userId)
        .select();

      console.log("Résultat suppression PDF:", { deletedPdfDocs, pdfError });

      if (pdfError) {
        console.error("Erreur lors de la suppression des documents PDF:", pdfError);
        throw pdfError;
      }

      // Supprimer tous les documents des directives de l'utilisateur
      console.log("Tentative de suppression des directives...");
      const { data: deletedDirectives, error: directivesError } = await supabase
        .from('directives')
        .delete()
        .eq('user_id', userId)
        .select();

      console.log("Résultat suppression directives:", { deletedDirectives, directivesError });

      if (directivesError) {
        console.error("Erreur lors de la suppression des directives:", directivesError);
        throw directivesError;
      }

      const totalDeleted = (deletedPdfDocs?.length || 0) + (deletedDirectives?.length || 0);
      console.log("Total des documents supprimés:", totalDeleted);

      toast({
        title: "Documents supprimés",
        description: `${totalDeleted} document${totalDeleted > 1 ? 's' : ''} supprimé${totalDeleted > 1 ? 's' : ''} avec succès`
      });

      // Recharger la page pour actualiser la liste
      console.log("Rechargement de la page...");
      window.location.reload();
      
    } catch (error) {
      console.error("=== ERREUR LORS DE LA SUPPRESSION ===");
      console.error("Détails de l'erreur:", error);
      console.error("Type d'erreur:", typeof error);
      console.error("Message d'erreur:", error?.message);
      
      toast({
        title: "Erreur",
        description: `Impossible de supprimer tous les documents: ${error?.message || 'Erreur inconnue'}`,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAllDialog(false);
      console.log("=== FIN SUPPRESSION DE TOUS LES DOCUMENTS ===");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DirectivesPageHeader 
        onDeleteAllDocuments={userId ? () => setShowDeleteAllDialog(true) : undefined}
        documentsCount={documents.length}
      />

      {showAddOptions && userId && (
        <DirectivesAddDocumentSection 
          showAddOptions={showAddOptions}
          setShowAddOptions={setShowAddOptions}
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
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllDocuments}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : `Supprimer tout (${documents.length})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DirectivesPageContainer;

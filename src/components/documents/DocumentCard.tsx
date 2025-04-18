
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Document } from "@/components/documents/types";
import { DocumentMeta } from "./card/DocumentMeta";
import { DocumentActions } from "./card/DocumentActions";
import { DeleteConfirmDialog } from "./card/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentCardProps {
  document: Document;
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
  isAuthenticated: boolean;
  onDelete?: (documentId: string) => void;
}

export function DocumentCard({ 
  document,
  onPreview,
  isAuthenticated,
  onDelete
}: DocumentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteDocument = async () => {
    if (!document.id || !onDelete) return;
    
    try {
      setIsDeleting(true);
      
      if (document.file_path) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' 
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        const { error: storageError } = await supabase
          .storage
          .from(bucket)
          .remove([path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
        }
      }
      
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      onDelete(document.id);
      
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card key={document.id} className="p-4">
        <div className="flex items-start justify-between">
          <DocumentMeta
            description={document.description || ""}
            createdAt={document.created_at}
            externalId={document.external_id}
            isCard={document.file_path?.includes('cards/')}
          />
          
          <DocumentActions
            document={document}
            isAuthenticated={isAuthenticated}
            onPreview={onPreview}
            onDelete={() => setShowDeleteDialog(true)}
          />
        </div>
      </Card>
      
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteDocument}
        isDeleting={isDeleting}
      />
    </>
  );
}

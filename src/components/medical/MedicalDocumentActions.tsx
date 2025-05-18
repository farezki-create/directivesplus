
import React from "react";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useMedicalDocumentActions } from "@/hooks/useMedicalDocumentActions";

export { useMedicalDocumentActions };

interface MedicalDocumentActionsProps {
  documentToDelete: string | null;
  setDocumentToDelete: (id: string | null) => void;
  previewDocument: string | null;
  setPreviewDocument: (path: string | null) => void;
  handleDelete: () => Promise<void>;
}

const MedicalDocumentActions = ({
  documentToDelete,
  setDocumentToDelete,
  previewDocument,
  setPreviewDocument,
  handleDelete
}: MedicalDocumentActionsProps) => {
  return (
    <>
      <DeleteConfirmationDialog 
        isOpen={!!documentToDelete} 
        onClose={() => setDocumentToDelete(null)} 
        onConfirm={handleDelete}
      />

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={() => setPreviewDocument(null)} 
      />
    </>
  );
};

export default MedicalDocumentActions;

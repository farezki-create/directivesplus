
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
  handleDownload?: (filePath: string, fileName: string) => void;
  handlePrint?: (filePath: string, fileType?: string) => void;
}

const MedicalDocumentActions = ({
  documentToDelete,
  setDocumentToDelete,
  previewDocument,
  setPreviewDocument,
  handleDelete,
  handleDownload,
  handlePrint
}: MedicalDocumentActionsProps) => {
  console.log("[MedicalDocumentActions] previewDocument:", previewDocument);
  
  return (
    <>
      <DeleteConfirmationDialog 
        isOpen={!!documentToDelete} 
        onClose={() => setDocumentToDelete(null)} 
        onConfirm={handleDelete}
      />

      <DocumentPreviewDialog 
        filePath={previewDocument} 
        onOpenChange={(open) => {
          console.log("[MedicalDocumentActions] onOpenChange:", open, "filePath:", previewDocument);
          if (!open) setPreviewDocument(null);
        }}
        onDownload={handleDownload ? (filePath) => {
          const fileName = filePath.split('/').pop() || 'document';
          handleDownload(filePath, fileName);
        } : undefined}
        onPrint={handlePrint ? (filePath) => {
          handlePrint(filePath);
        } : undefined}
      />
    </>
  );
};

export default MedicalDocumentActions;

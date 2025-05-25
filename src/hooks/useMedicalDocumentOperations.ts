
import { useMedicalDocumentState } from "./medical/useMedicalDocumentState";
import { useMedicalDocumentUpload } from "./medical/useMedicalDocumentUpload";
import { useMedicalDocumentActions } from "./medical/useMedicalDocumentActions";

interface UseMedicalDocumentOperationsProps {
  userId?: string;
  onDocumentAdd: (documentInfo: any) => void;
  onDocumentRemove?: (documentId: string) => void;
  onUploadComplete: () => void;
}

export const useMedicalDocumentOperations = ({
  userId,
  onDocumentAdd,
  onDocumentRemove,
  onUploadComplete
}: UseMedicalDocumentOperationsProps) => {
  
  const {
    uploadedDocuments,
    setUploadedDocuments,
    deletingDocuments,
    setDeletingDocuments,
    isProcessing,
    setIsProcessing
  } = useMedicalDocumentState(userId);

  const { handleDocumentUpload } = useMedicalDocumentUpload({
    userId,
    isProcessing,
    setIsProcessing,
    setUploadedDocuments,
    onDocumentAdd,
    onUploadComplete
  });

  const { handleDeleteDocument, handlePreviewDocument } = useMedicalDocumentActions({
    userId,
    deletingDocuments,
    setDeletingDocuments,
    setUploadedDocuments,
    onDocumentRemove
  });

  return {
    uploadedDocuments,
    deletingDocuments,
    handleDocumentUpload,
    handleDeleteDocument,
    handlePreviewDocument
  };
};

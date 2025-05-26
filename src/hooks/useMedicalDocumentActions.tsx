
import { useState } from "react";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const { handleVisibilityChange } = useDocumentVisibility();
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

  const handleView = (filePath: string, fileType?: string) => {
    console.log("useMedicalDocumentActions - handleView:", filePath);
    setPreviewDocument(filePath);
  };

  const confirmDelete = (documentId: string) => {
    console.log("useMedicalDocumentActions - confirmDelete:", documentId);
    setDocumentToDelete(documentId);
  };

  const handleDelete = async () => {
    // Cette fonction sera surchargée par le composant parent
    console.log("useMedicalDocumentActions - handleDelete appelé");
    onDeleteComplete();
    setDocumentToDelete(null);
  };

  console.log("useMedicalDocumentActions - état actuel:", {
    previewDocument,
    documentToDelete
  });

  return {
    documentToDelete,
    setDocumentToDelete,
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handlePrint,
    handleView,
    confirmDelete,
    handleDelete,
    handleVisibilityChange
  };
};

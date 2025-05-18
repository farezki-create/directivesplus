
import { useState } from "react";
import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentPreview } from "./useDocumentPreview";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { downloadDocument, shareDocument, viewDocument, printDocument } from "@/utils/documentOperations";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  // Use the specialized hooks
  const { previewDocument, setPreviewDocument } = useDocumentPreview();
  const { documentToDelete, setDocumentToDelete, confirmDelete, handleDelete } = useDocumentDeletion({ onDeleteComplete });
  const { handleVisibilityChange } = useDocumentVisibility();

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // Pour les fichiers audio ou autres formats prévisualisables, afficher dans une boîte de dialogue
      if (filePath.includes('audio') || 
          filePath.includes('pdf') || 
          filePath.includes('image') ||
          filePath.endsWith('.jpg') || 
          filePath.endsWith('.jpeg') || 
          filePath.endsWith('.png') || 
          filePath.endsWith('.pdf')) {
        setPreviewDocument(filePath);
        return;
      }
      
      downloadDocument(filePath, fileName);
    } catch (error) {
      console.error("Error in handleDownload:", error);
    }
  };

  const handlePrint = (filePath: string, fileType: string = "application/pdf") => {
    printDocument(filePath, fileType);
  };

  const handleShare = (documentId: string) => {
    shareDocument(documentId);
  };
  
  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    viewDocument(filePath, fileType, setPreviewDocument);
  };

  return {
    documentToDelete,
    setDocumentToDelete,
    previewDocument,
    setPreviewDocument,
    handleDownload,
    handlePrint,
    handleShare,
    handleView,
    confirmDelete,
    handleDelete,
    handleVisibilityChange
  };
};

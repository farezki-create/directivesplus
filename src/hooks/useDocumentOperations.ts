
import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentViewer } from "./useDocumentViewer";
import { ErrorType, handleError } from "@/utils/error-handling";
import { useState } from "react";

/**
 * Hook qui combine toutes les opérations sur les documents dans une interface unique
 * Sert de pattern façade pour simplifier l'accès aux opérations sur les documents
 * avec gestion d'erreurs améliorée
 */
export const useDocumentOperations = (refreshDocuments: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Document viewing and preview operations
  const { 
    previewDocument, 
    setPreviewDocument, 
    handleView: originalHandleView
  } = useDocumentViewer();
  
  // Document deletion operations
  const { 
    documentToDelete, 
    setDocumentToDelete, 
    confirmDelete, 
    handleDelete 
  } = useDocumentDeletion({ 
    onDeleteComplete: refreshDocuments, 
    tableName: "pdf_documents" 
  });
  
  // Other document operations with enhanced error handling
  const { handleDownload: originalHandleDownload } = useDocumentDownload();
  const { handlePrint: originalHandlePrint } = useDocumentPrint();
  
  // Wrapper for download with error handling
  const handleDownload = async (file: any) => {
    console.log("useDocumentOperations - handleDownload called with:", file);
    setIsProcessing(true);
    try {
      await originalHandleDownload(file.file_path, file.file_name);
    } catch (error) {
      await handleError({
        error,
        type: ErrorType.NETWORK,
        component: "DocumentOperations",
        operation: "download",
        showToast: true,
        toastMessage: "Impossible de télécharger le document. Veuillez réessayer."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Wrapper for print with error handling
  const handlePrint = async (file: any) => {
    console.log("useDocumentOperations - handlePrint called with:", file);
    setIsProcessing(true);
    try {
      await originalHandlePrint(file.file_path, file.file_type || file.content_type);
    } catch (error) {
      await handleError({
        error,
        type: ErrorType.UNKNOWN,
        component: "DocumentOperations",
        operation: "print",
        showToast: true,
        toastMessage: "Impossible d'imprimer le document. Veuillez réessayer."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Enhanced view with error handling
  const handleView = async (file: any) => {
    console.log("useDocumentOperations - handleView called with:", file);
    setIsProcessing(true);
    try {
      setPreviewDocument(file.file_path);
      await originalHandleView(file.file_path, file.file_type || file.content_type);
    } catch (error) {
      await handleError({
        error,
        type: ErrorType.NETWORK,
        component: "DocumentOperations",
        operation: "view",
        showToast: true,
        toastMessage: "Impossible d'afficher le document. Veuillez réessayer."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  console.log("useDocumentOperations - état actuel:", { 
    previewDocument, 
    documentToDelete,
    isProcessing
  });
  
  // Return a unified API for all document operations
  return {
    // Processing state
    isProcessing,
    
    // Preview operations
    previewDocument,
    setPreviewDocument,
    
    // Deletion operations
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete,
    
    // Other document operations with enhanced error handling
    handleDownload,
    handlePrint,
    handleView
  };
};

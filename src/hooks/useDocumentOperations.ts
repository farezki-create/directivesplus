
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
  
  // Wrapper for download with improved parameter handling
  const handleDownload = async (filePathOrDocument: any, fileName?: string) => {
    console.log("useDocumentOperations - handleDownload called with:", filePathOrDocument, fileName);
    setIsProcessing(true);
    try {
      let filePath: string;
      let finalFileName: string;
      
      // Handle both document objects and direct file paths
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        finalFileName = fileName || 'document.pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        finalFileName = fileName || filePathOrDocument?.file_name || 'document.pdf';
      }
      
      console.log("useDocumentOperations - Processing download:", filePath, finalFileName);
      await originalHandleDownload(filePath, finalFileName);
    } catch (error) {
      console.error("useDocumentOperations - Download error:", error);
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
  
  // Wrapper for print with improved parameter handling
  const handlePrint = async (filePathOrDocument: any, contentType?: string) => {
    console.log("useDocumentOperations - handlePrint called with:", filePathOrDocument, contentType);
    setIsProcessing(true);
    try {
      let filePath: string;
      let fileType: string;
      
      // Handle both document objects and direct file paths
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        fileType = contentType || 'application/pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        fileType = contentType || filePathOrDocument?.content_type || filePathOrDocument?.file_type || 'application/pdf';
      }
      
      console.log("useDocumentOperations - Processing print:", filePath, fileType);
      await originalHandlePrint(filePath, fileType);
    } catch (error) {
      console.error("useDocumentOperations - Print error:", error);
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
  
  // Enhanced view with improved parameter handling
  const handleView = async (filePathOrDocument: any, contentType?: string) => {
    console.log("useDocumentOperations - handleView called with:", filePathOrDocument, contentType);
    setIsProcessing(true);
    try {
      let filePath: string;
      let fileType: string;
      
      // Handle both document objects and direct file paths
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        fileType = contentType || 'application/pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        fileType = contentType || filePathOrDocument?.content_type || filePathOrDocument?.file_type || 'application/pdf';
      }
      
      console.log("useDocumentOperations - Setting preview document:", filePath);
      setPreviewDocument(filePath);
      
      console.log("useDocumentOperations - Processing view:", filePath, fileType);
      await originalHandleView(filePath, fileType);
    } catch (error) {
      console.error("useDocumentOperations - View error:", error);
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

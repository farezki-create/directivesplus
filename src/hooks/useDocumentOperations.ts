
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
  
  const { 
    previewDocument, 
    setPreviewDocument, 
    handleView: originalHandleView
  } = useDocumentViewer();
  
  const { 
    documentToDelete, 
    setDocumentToDelete, 
    confirmDelete, 
    handleDelete 
  } = useDocumentDeletion({ 
    onDeleteComplete: refreshDocuments, 
    tableName: "pdf_documents" 
  });
  
  const { handleDownload: originalHandleDownload } = useDocumentDownload();
  const { handlePrint: originalHandlePrint } = useDocumentPrint();
  
  const handleDownload = async (filePathOrDocument: any, fileName?: string) => {
    setIsProcessing(true);
    try {
      let filePath: string;
      let finalFileName: string;
      
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        finalFileName = fileName || 'document.pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        finalFileName = fileName || filePathOrDocument?.file_name || 'document.pdf';
      }
      
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
  
  const handlePrint = async (filePathOrDocument: any, contentType?: string) => {
    setIsProcessing(true);
    try {
      let filePath: string;
      let fileType: string;
      
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        fileType = contentType || 'application/pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        fileType = contentType || filePathOrDocument?.content_type || filePathOrDocument?.file_type || 'application/pdf';
      }
      
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
  
  const handleView = async (filePathOrDocument: any, contentType?: string) => {
    setIsProcessing(true);
    try {
      let filePath: string;
      let fileType: string;
      
      if (typeof filePathOrDocument === 'string') {
        filePath = filePathOrDocument;
        fileType = contentType || 'application/pdf';
      } else {
        filePath = filePathOrDocument?.file_path || filePathOrDocument;
        fileType = contentType || filePathOrDocument?.content_type || filePathOrDocument?.file_type || 'application/pdf';
      }
      
      setPreviewDocument(filePath);
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
  
  return {
    isProcessing,
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete,
    handleDownload,
    handlePrint,
    handleView
  };
};

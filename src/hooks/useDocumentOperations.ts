import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentShare } from "./useDocumentShare";
import { useDocumentViewer } from "./useDocumentViewer";

/**
 * Hook that combines all document operations into a single interface
 * This serves as a facade pattern to simplify access to document operations
 */
export const useDocumentOperations = (refreshDocuments: () => void) => {
  // Document viewing and preview operations
  const { 
    previewDocument, 
    setPreviewDocument, 
    handleView 
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
  
  // Other document operations
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();
  const { handleShare } = useDocumentShare();
  
  console.log("useDocumentOperations - état actuel:", { 
    previewDocument, 
    documentToDelete 
  });
  
  // Return a unified API for all document operations
  return {
    // Preview operations
    previewDocument,
    setPreviewDocument,
    
    // Deletion operations
    documentToDelete,
    setDocumentToDelete,
    confirmDelete,
    handleDelete,
    
    // Other document operations
    handleDownload,
    handlePrint,
    handleShare,
    handleView
  };
};

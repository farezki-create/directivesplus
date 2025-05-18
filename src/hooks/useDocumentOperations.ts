
import { useDocumentPreview } from "./useDocumentPreview";
import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentShare } from "./useDocumentShare";
import { useDocumentView } from "./useDocumentView";

interface UseDocumentOperationsProps {
  refreshDocuments: () => void;
}

export const useDocumentOperations = (refreshDocuments: () => void) => {
  const { previewDocument, setPreviewDocument } = useDocumentPreview();
  const { documentToDelete, setDocumentToDelete, confirmDelete, handleDelete } = 
    useDocumentDeletion({ onDeleteComplete: refreshDocuments });
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();
  const { handleShare } = useDocumentShare();
  const { handleView } = useDocumentView();
  
  return {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleShare,
    handleView,
    confirmDelete,
    handleDelete
  };
};

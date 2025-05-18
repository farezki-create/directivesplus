
import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentPreview } from "./useDocumentPreview";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentViewer } from "./useDocumentViewer";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  // Utilisation du hook combiné useDocumentViewer au lieu de useDocumentView et useDocumentPreview séparément
  const { previewDocument, setPreviewDocument, handleView } = useDocumentViewer();
  
  const { documentToDelete, setDocumentToDelete, confirmDelete, handleDelete } = 
    useDocumentDeletion({ onDeleteComplete, tableName: "medical_documents" });
  const { handleVisibilityChange } = useDocumentVisibility();
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();

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

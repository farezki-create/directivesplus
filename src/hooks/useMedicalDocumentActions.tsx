
import { useDocumentDeletion } from "./useDocumentDeletion";
import { useDocumentPreview } from "./useDocumentPreview";
import { useDocumentVisibility } from "./useDocumentVisibility";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";
import { useDocumentShare } from "./useDocumentShare";
import { useDocumentView } from "./useDocumentView";

interface UseMedicalDocumentActionsProps {
  onDeleteComplete: () => void;
}

export const useMedicalDocumentActions = ({ onDeleteComplete }: UseMedicalDocumentActionsProps) => {
  // Utilisation des hooks spécialisés
  const { previewDocument, setPreviewDocument } = useDocumentPreview();
  const { documentToDelete, setDocumentToDelete, confirmDelete, handleDelete } = 
    useDocumentDeletion({ onDeleteComplete, tableName: "medical_documents" });
  const { handleVisibilityChange } = useDocumentVisibility();
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();
  const { handleShare } = useDocumentShare();
  const { handleView } = useDocumentView();

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
    handleShare,
    handleView,
    confirmDelete,
    handleDelete,
    handleVisibilityChange
  };
};

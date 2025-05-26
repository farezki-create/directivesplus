
import { useState, useCallback } from "react";

interface QRCodeModalState {
  documentId: string | null;
  documentName: string;
  filePath?: string;
}

export const useQRCodeModal = () => {
  const [modalState, setModalState] = useState<QRCodeModalState>({
    documentId: null,
    documentName: "",
    filePath: undefined
  });

  const openQRCodeModal = useCallback((documentId: string, documentName: string = "Document", filePath?: string) => {
    if (!documentId || documentId.trim() === '') {
      console.error("useQRCodeModal: ID du document invalide", { documentId, documentName });
      return false;
    }

    console.log("useQRCodeModal: Ouverture modal pour", { documentId, documentName, filePath });

    setModalState({
      documentId: documentId.trim(),
      documentName: documentName.trim() || "Document",
      filePath
    });

    return true;
  }, []);

  const closeQRCodeModal = useCallback(() => {
    console.log("useQRCodeModal: Fermeture modal");
    setModalState({
      documentId: null,
      documentName: "",
      filePath: undefined
    });
  }, []);

  const isOpen = Boolean(modalState.documentId);

  return {
    qrCodeModalState: modalState,
    isQRCodeModalOpen: isOpen,
    openQRCodeModal,
    closeQRCodeModal
  };
};

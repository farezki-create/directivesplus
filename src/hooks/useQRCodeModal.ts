
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
      return;
    }

    setModalState({
      documentId,
      documentName,
      filePath
    });
  }, []);

  const closeQRCodeModal = useCallback(() => {
    setModalState({
      documentId: null,
      documentName: "",
      filePath: undefined
    });
  }, []);

  const isOpen = modalState.documentId !== null;

  return {
    qrCodeModalState: modalState,
    isQRCodeModalOpen: isOpen,
    openQRCodeModal,
    closeQRCodeModal
  };
};

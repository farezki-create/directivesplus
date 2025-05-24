
import { useState, useCallback } from "react";

interface QRCodeModalState {
  documentId: string | null;
  documentName: string;
}

export const useQRCodeModal = () => {
  const [modalState, setModalState] = useState<QRCodeModalState>({
    documentId: null,
    documentName: ""
  });

  const openQRCodeModal = useCallback((documentId: string, documentName: string = "Document") => {
    if (!documentId || documentId.trim() === '') {
      console.error("useQRCodeModal: ID du document invalide", { documentId, documentName });
      return;
    }

    setModalState({
      documentId,
      documentName
    });
  }, []);

  const closeQRCodeModal = useCallback(() => {
    setModalState({
      documentId: null,
      documentName: ""
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

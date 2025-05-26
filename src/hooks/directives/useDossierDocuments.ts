
import { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { Document } from "@/types/documents";
import { extractDocumentsFromDossier } from "./utils/documentExtractor";
import { 
  handleDossierDownload, 
  handleDossierPrint, 
  handleDossierView, 
  handleDossierUploadComplete, 
  handleDossierDelete 
} from "./utils/documentHandlers";

export const useDossierDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { dossierActif } = useDossierStore();

  useEffect(() => {
    const loadDocuments = () => {
      const foundDocuments = extractDocumentsFromDossier(dossierActif);
      setDocuments(foundDocuments);
      setIsLoading(false);
    };

    loadDocuments();
  }, [dossierActif]);

  return {
    user: null,
    isAuthenticated: false,
    documents,
    isLoading,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload: handleDossierDownload,
    handlePrint: handleDossierPrint,
    handleView: handleDossierView,
    handleDelete: handleDossierDelete,
    handleUploadComplete: handleDossierUploadComplete
  };
};

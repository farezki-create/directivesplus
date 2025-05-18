
import { useState } from "react";

/**
 * Hook for managing document preview state
 * Maintains the currently previewed document path
 */
export const useDocumentPreview = () => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  return {
    previewDocument,
    setPreviewDocument
  };
};


import { useState } from "react";

export const useDocumentPreview = () => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);

  return {
    previewDocument,
    setPreviewDocument
  };
};

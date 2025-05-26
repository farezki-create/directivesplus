
import { useState } from "react";

export const useDirectivesState = () => {
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [showAddOptionsPublic, setShowAddOptionsPublic] = useState(false);

  return {
    previewDocument,
    setPreviewDocument,
    showAddOptionsPublic,
    setShowAddOptionsPublic
  };
};

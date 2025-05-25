
import { useState } from "react";
import { Document } from "@/types/documents";

export const useDirectivesState = () => {
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [showAddOptionsPublic, setShowAddOptionsPublic] = useState(false);

  return {
    previewDocument,
    setPreviewDocument,
    showAddOptionsPublic,
    setShowAddOptionsPublic
  };
};

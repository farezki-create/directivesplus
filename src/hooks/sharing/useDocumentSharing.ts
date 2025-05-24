
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createSharedDocument } from "./services/sharedDocumentService";
import { formatShareMessage } from "./sharingUtils";
import type { ShareableDocument, ShareOptions } from "./types";

export const useDocumentSharing = () => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const shareDocument = async (
    document: ShareableDocument, 
    options: ShareOptions = {}
  ): Promise<string | null> => {
    if (!document.user_id) {
      toast({
        title: "Erreur",
        description: "Impossible de partager ce document",
        variant: "destructive"
      });
      return null;
    }

    setIsSharing(document.id);
    setShareError(null);

    try {
      console.log("Partage document:", document, options);
      const accessCode = await createSharedDocument(document, options);

      if (!accessCode) {
        throw new Error("No access code returned");
      }

      toast({
        title: "Document partagé",
        description: formatShareMessage(document.file_name, accessCode),
      });

      return accessCode;

    } catch (error: any) {
      console.error("Erreur lors du partage du document:", error);
      setShareError(error.message);
      toast({
        title: "Erreur",
        description: "Impossible de partager le document: " + error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSharing(null);
    }
  };

  return {
    shareDocument,
    isSharing,
    shareError
  };
};

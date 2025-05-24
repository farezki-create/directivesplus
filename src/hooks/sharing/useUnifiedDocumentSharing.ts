
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  createSharedDocument, 
  getSharedDocuments as fetchSharedDocuments,
  getSharedDocumentsByAccessCode as fetchSharedDocumentsByAccessCode,
  deactivateSharedDocument 
} from "./sharingService";
import { generateInstitutionAccessCode } from "./institutionSharingService";
import { formatShareMessage } from "./sharingUtils";
import type { ShareableDocument, ShareOptions } from "./types";

export const useUnifiedDocumentSharing = () => {
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
        description: "Impossible de partager le document",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSharing(null);
    }
  };

  const getSharedDocuments = async (): Promise<any[]> => {
    try {
      return await fetchSharedDocuments();
    } catch (error) {
      console.error("Erreur lors de la récupération des documents partagés:", error);
      return [];
    }
  };

  const getSharedDocumentsByAccessCode = async (
    accessCode: string,
    firstName?: string,
    lastName?: string,
    birthDate?: string
  ): Promise<any[]> => {
    try {
      return await fetchSharedDocumentsByAccessCode(accessCode, firstName, lastName, birthDate);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents avec code:", error);
      return [];
    }
  };

  const stopSharing = async (sharedDocumentId: string): Promise<boolean> => {
    try {
      await deactivateSharedDocument(sharedDocumentId);

      toast({
        title: "Partage arrêté",
        description: "Le document a été retiré du dossier partagé",
      });

      return true;
    } catch (error: any) {
      console.error("Erreur lors de l'arrêt du partage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter le partage",
        variant: "destructive"
      });
      return false;
    }
  };

  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    if (!document.user_id) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
      return null;
    }

    setIsSharing(document.id);
    setShareError(null);

    try {
      const accessCode = await generateInstitutionAccessCode(document, expiresInDays);

      if (!accessCode) {
        throw new Error("No access code returned");
      }

      return accessCode;
    } catch (error: any) {
      console.error("Erreur lors de la génération du code institution:", error);
      setShareError(error.message);
      throw error;
    } finally {
      setIsSharing(null);
    }
  };

  return {
    shareDocument,
    generateInstitutionCode,
    getSharedDocuments,
    getSharedDocumentsByAccessCode,
    stopSharing,
    isSharing,
    shareError
  };
};

// Export types for use in other components
export type { ShareableDocument, ShareOptions } from "./types";

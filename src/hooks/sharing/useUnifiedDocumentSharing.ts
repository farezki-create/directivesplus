
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  createSharedDocument, 
  getSharedDocuments as fetchSharedDocuments,
  getSharedDocumentsByAccessCode as fetchSharedDocumentsByAccessCode,
  deactivateSharedDocument,
  extendSharedDocumentExpiry,
  regenerateAccessCode
} from "./sharingService";
import { generateInstitutionAccessCode } from "./institutionSharingService";
import { formatShareMessage } from "./sharingUtils";
import type { ShareableDocument, ShareOptions } from "./types";

export const useUnifiedDocumentSharing = () => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

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

  const extendAccessCode = async (
    accessCode: string,
    additionalDays: number = 365
  ): Promise<boolean> => {
    if (!accessCode) {
      toast({
        title: "Erreur",
        description: "Code d'accès manquant",
        variant: "destructive"
      });
      return false;
    }

    setIsExtending(true);
    try {
      console.log("Prolongation code d'accès:", accessCode, additionalDays);
      const success = await extendSharedDocumentExpiry(accessCode, additionalDays);
      
      if (success) {
        toast({
          title: "Code prolongé",
          description: `Le code d'accès a été prolongé de ${additionalDays} jours`,
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de prolonger le code d'accès",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error: any) {
      console.error("Erreur prolongation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prolonger le code d'accès: " + error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsExtending(false);
    }
  };

  const regenerateCode = async (
    currentAccessCode: string,
    expiresInDays: number = 365
  ): Promise<string | null> => {
    if (!currentAccessCode) {
      toast({
        title: "Erreur",
        description: "Code d'accès actuel manquant",
        variant: "destructive"
      });
      return null;
    }

    setIsRegenerating(true);
    try {
      console.log("Régénération code d'accès:", currentAccessCode, expiresInDays);
      const newCode = await regenerateAccessCode(currentAccessCode, expiresInDays);
      
      if (newCode) {
        toast({
          title: "Code régénéré",
          description: `Nouveau code d'accès généré : ${newCode}`,
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de régénérer le code d'accès",
          variant: "destructive"
        });
      }
      
      return newCode;
    } catch (error: any) {
      console.error("Erreur régénération:", error);
      toast({
        title: "Erreur",
        description: "Impossible de régénérer le code d'accès: " + error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsRegenerating(false);
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
      console.log("Génération code institution:", document, expiresInDays);
      const accessCode = await generateInstitutionAccessCode(document, expiresInDays);

      if (!accessCode) {
        throw new Error("No access code returned");
      }

      console.log("Code institution généré avec succès:", accessCode);
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
    extendAccessCode,
    regenerateCode,
    isSharing,
    shareError,
    isExtending,
    isRegenerating
  };
};

// Export types for use in other components
export type { ShareableDocument, ShareOptions } from "./types";

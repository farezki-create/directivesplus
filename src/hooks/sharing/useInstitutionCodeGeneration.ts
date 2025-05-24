
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { generateInstitutionAccessCode } from "./institutionSharingService";
import type { ShareableDocument } from "./types";

export const useInstitutionCodeGeneration = () => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

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
    generateInstitutionCode,
    isSharing,
    shareError
  };
};

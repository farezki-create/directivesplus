import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  extendSharedDocumentExpiry,
  regenerateAccessCode
} from "./services/accessCodeService";

export const useAccessCodeManagement = () => {
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

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

  return {
    extendAccessCode,
    regenerateCode,
    isExtending,
    isRegenerating
  };
};


import { toast } from "@/hooks/use-toast";

/**
 * Validates that an access code has been provided
 */
export const validateAccessCode = (code: string): boolean => {
  if (!code || code.trim() === '') {
    toast({
      variant: "destructive",
      title: "Code manquant",
      description: "Veuillez saisir un code d'accès valide"
    });
    return false;
  }
  return true;
};

/**
 * Validates dossier response data
 */
export const validateDossierResponse = (result: any): boolean => {
  if (!result || !result.success) {
    const errorMessage = result?.error || "Erreur lors de l'accès au dossier";
    toast({
      variant: "destructive",
      title: "Erreur d'accès",
      description: errorMessage
    });
    return false;
  }
  
  if (!result.dossier) {
    toast({
      variant: "destructive",
      title: "Erreur d'accès",
      description: "Le serveur n'a pas retourné de dossier"
    });
    return false;
  }
  
  return true;
};

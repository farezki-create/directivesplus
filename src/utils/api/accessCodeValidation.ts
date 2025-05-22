
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

/**
 * Validates public access form data
 */
export const validatePublicAccessData = (formData: any): boolean => {
  if (!formData.firstName || formData.firstName.trim() === '') {
    toast({
      variant: "destructive",
      title: "Données incomplètes",
      description: "Le prénom est requis"
    });
    return false;
  }
  
  if (!formData.lastName || formData.lastName.trim() === '') {
    toast({
      variant: "destructive",
      title: "Données incomplètes",
      description: "Le nom est requis"
    });
    return false;
  }
  
  if (!formData.birthDate) {
    toast({
      variant: "destructive",
      title: "Données incomplètes",
      description: "La date de naissance est requise"
    });
    return false;
  }
  
  if (!formData.accessCode || formData.accessCode.trim() === '') {
    toast({
      variant: "destructive",
      title: "Données incomplètes",
      description: "Le code d'accès est requis"
    });
    return false;
  }
  
  return true;
};

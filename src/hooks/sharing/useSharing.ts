
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SharingService } from "./core/sharingService";
import type { ShareableDocument, ShareOptions } from "./types";

/**
 * Hook simplifié pour toutes les opérations de partage
 */
export const useSharing = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePersonalCode = async (
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.generateAccessCode(document, {
        ...options,
        accessType: 'personal'
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code généré",
          description: "Le code d'accès personnel a été généré avec succès"
        });
        return result.code;
      } else {
        setError(result.error || "Erreur lors de la génération");
        toast({
          title: "Erreur",
          description: result.error || "Impossible de générer le code",
          variant: "destructive"
        });
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.generateAccessCode(document, {
        accessType: 'institution',
        expiresInDays
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code professionnel généré",
          description: `Code valide pendant ${expiresInDays} jours`
        });
        return result.code;
      } else {
        setError(result.error || "Erreur lors de la génération");
        toast({
          title: "Erreur",
          description: result.error || "Impossible de générer le code professionnel",
          variant: "destructive"
        });
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const validateAccessCode = async (
    accessCode: string,
    personalInfo?: any
  ) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const result = await SharingService.validateAccessCode(accessCode, personalInfo);
      
      if (!result.success) {
        setError(result.error || "Code invalide");
      }
      
      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsValidating(false);
    }
  };

  const extendCode = async (
    accessCode: string,
    days: number = 365
  ): Promise<boolean> => {
    setIsExtending(true);
    setError(null);
    
    try {
      const result = await SharingService.extendAccessCode(accessCode, days);
      
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Le code a été prolongé de ${days} jours`
        });
        return true;
      } else {
        setError(result.error || "Erreur lors de la prolongation");
        toast({
          title: "Erreur",
          description: result.error || "Impossible de prolonger le code",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsExtending(false);
    }
  };

  const regenerateCode = async (
    currentCode: string,
    days: number = 365
  ): Promise<string | null> => {
    setIsRegenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.regenerateAccessCode(currentCode, days);
      
      if (result.success && result.code) {
        toast({
          title: "Nouveau code généré",
          description: "L'ancien code a été désactivé"
        });
        return result.code;
      } else {
        setError(result.error || "Erreur lors de la régénération");
        toast({
          title: "Erreur",
          description: result.error || "Impossible de régénérer le code",
          variant: "destructive"
        });
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  const revokeCode = async (accessCode: string): Promise<boolean> => {
    setError(null);
    
    try {
      const result = await SharingService.revokeAccessCode(accessCode);
      
      if (result.success) {
        toast({
          title: "Code révoqué",
          description: "Le code d'accès a été désactivé"
        });
        return true;
      } else {
        setError(result.error || "Erreur lors de la révocation");
        return false;
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    generatePersonalCode,
    generateInstitutionCode,
    validateAccessCode,
    extendCode,
    regenerateCode,
    revokeCode,
    isGenerating,
    isValidating,
    isExtending,
    isRegenerating,
    error
  };
};

export type { ShareableDocument, ShareOptions } from "./types";

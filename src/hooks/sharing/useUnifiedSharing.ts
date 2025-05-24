
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedSharingService } from "./core/unifiedSharingService";
import type { ShareableDocument, ShareOptions } from "./types";

export interface UseUnifiedSharingReturn {
  // Actions principales
  generatePersonalCode: (document: ShareableDocument, options?: ShareOptions) => Promise<string | null>;
  generateInstitutionCode: (document: ShareableDocument, expiresInDays?: number) => Promise<string | null>;
  validateAccessCode: (accessCode: string, personalInfo?: any) => Promise<any>;
  
  // Gestion des codes
  extendCode: (accessCode: string, days?: number) => Promise<boolean>;
  regenerateCode: (currentCode: string, days?: number) => Promise<string | null>;
  revokeCode: (accessCode: string) => Promise<boolean>;
  
  // États
  isGenerating: boolean;
  isValidating: boolean;
  isExtending: boolean;
  isRegenerating: boolean;
  error: string | null;
}

/**
 * Hook unifié pour toutes les opérations de partage
 * Remplace tous les hooks fragmentés existants
 */
export const useUnifiedSharing = (): UseUnifiedSharingReturn => {
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
      const result = await UnifiedSharingService.generateAccessCode(document, {
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
      const result = await UnifiedSharingService.generateAccessCode(document, {
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
  ): Promise<any> => {
    setIsValidating(true);
    setError(null);
    
    try {
      const result = await UnifiedSharingService.validateAccessCode(accessCode, personalInfo);
      
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
      const result = await UnifiedSharingService.extendAccessCode(accessCode, days);
      
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
      const result = await UnifiedSharingService.regenerateAccessCode(currentCode, days);
      
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
      const result = await UnifiedSharingService.revokeAccessCode(accessCode);
      
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

// Export des types pour compatibilité
export type { ShareableDocument, ShareOptions } from "./types";

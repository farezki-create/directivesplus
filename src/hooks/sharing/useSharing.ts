
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SharingService } from "@/services/sharingService";
import type { ShareableDocument, AccessValidationResult } from "@/types/sharing";

// Re-export types for backward compatibility
export type { ShareableDocument } from "@/types/sharing";

/**
 * Hook unifié pour la gestion du partage
 */
export const useSharing = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Génère un code d'accès personnel
   */
  const generatePersonalCode = async (
    document: ShareableDocument,
    options: { expiresInDays?: number } = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.generateAccessCode(document, {
        expiresInDays: options.expiresInDays || 365,
        accessType: 'personal'
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code généré",
          description: "Code d'accès personnel créé avec succès"
        });
        return result.code;
      } else {
        throw new Error(result.error || "Erreur lors de la génération du code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la génération du code";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Génère un code d'accès institutionnel
   */
  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.generateAccessCode(document, {
        expiresInDays,
        accessType: 'institution'
      });
      
      if (result.success && result.code) {
        toast({
          title: "Code professionnel généré",
          description: "Code d'accès institutionnel créé avec succès"
        });
        return result.code;
      } else {
        throw new Error(result.error || "Erreur lors de la génération du code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la génération du code";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Valide un code d'accès
   */
  const validateAccessCode = async (
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessValidationResult> => {
    setIsValidating(true);
    try {
      const result = await SharingService.validateAccessCode(accessCode, personalInfo);
      return result;
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Erreur lors de la validation"
      };
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Prolonge un code d'accès
   */
  const extendCode = async (
    accessCode: string,
    days: number = 365
  ): Promise<boolean> => {
    setIsExtending(true);
    try {
      const result = await SharingService.extendAccessCode(accessCode, days);
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Code d'accès prolongé de ${days} jours`
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de prolonger le code",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsExtending(false);
    }
  };

  /**
   * Régénère un code d'accès
   */
  const regenerateCode = async (
    currentCode: string,
    days: number = 365
  ): Promise<string | null> => {
    setIsRegenerating(true);
    try {
      const result = await SharingService.regenerateAccessCode(currentCode, days);
      if (result.success && result.code) {
        toast({
          title: "Code régénéré",
          description: "Nouveau code d'accès créé avec succès"
        });
        return result.code;
      }
      return null;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de régénérer le code",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  return {
    // État
    isGenerating,
    isValidating,
    isExtending,
    isRegenerating,
    error,
    
    // Actions
    generatePersonalCode,
    generateInstitutionCode,
    validateAccessCode,
    extendCode,
    regenerateCode
  };
};

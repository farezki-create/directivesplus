import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { UnifiedCodeGenerationService } from "./services/unifiedCodeGeneration";
import { UnifiedAccessValidationService } from "./services/unifiedAccessValidation";
import type { ShareableDocument, ShareOptions, AccessCodeValidationResult } from "./types/index";

/**
 * Hook unifié pour toutes les opérations de partage
 * Remplace useUnifiedDocumentSharing, useInstitutionCodeGeneration, etc.
 */
export const useUnifiedSharing = () => {
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
    options: ShareOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.generatePersonalCode(document, options);
      
      if (result.success && result.code) {
        toast({
          title: "Code généré",
          description: `Code d'accès personnel créé : ${result.code}`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la génération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de générer le code d'accès";
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
   * Génère un code d'accès institution
   */
  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.generateInstitutionCode(document, expiresInDays);
      
      if (result.success && result.code) {
        toast({
          title: "Code institution généré",
          description: `Code d'accès professionnel créé (valide ${expiresInDays} jours)`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la génération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de générer le code d'accès professionnel";
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
   * Prolonge un code d'accès
   */
  const extendCode = async (
    accessCode: string,
    additionalDays: number = 365
  ): Promise<boolean> => {
    setIsExtending(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.extendCode(accessCode, additionalDays);
      
      if (result.success) {
        toast({
          title: "Code prolongé",
          description: `Code d'accès prolongé de ${additionalDays} jours`,
        });
        return true;
      } else {
        throw new Error(result.error || "Échec de la prolongation");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de prolonger le code d'accès";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
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
    expiresInDays: number = 365
  ): Promise<string | null> => {
    setIsRegenerating(true);
    setError(null);

    try {
      const result = await UnifiedCodeGenerationService.regenerateCode(currentCode, expiresInDays);
      
      if (result.success && result.code) {
        toast({
          title: "Code régénéré",
          description: `Nouveau code d'accès : ${result.code}`,
        });
        return result.code;
      } else {
        throw new Error(result.error || "Échec de la régénération");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Impossible de régénérer le code d'accès";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsRegenerating(false);
    }
  };

  /**
   * Valide un code d'accès
   */
  const validateAccess = async (
    accessCode: string,
    patientInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessCodeValidationResult> => {
    setIsValidating(true);
    setError(null);

    try {
      const result = await UnifiedAccessValidationService.validateAccessCode(accessCode, patientInfo);
      
      if (result.success) {
        toast({
          title: "Accès autorisé",
          description: result.message,
        });
      } else {
        toast({
          title: "Accès refusé",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la validation";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    // États
    isGenerating,
    isValidating,
    isExtending,
    isRegenerating,
    error,
    
    // Actions
    generatePersonalCode,
    generateInstitutionCode,
    extendCode,
    regenerateCode,
    validateAccess,
    
    // Alias pour compatibilité avec l'ancien système
    shareDocument: generatePersonalCode,
    isSharing: isGenerating,
    shareError: error
  };
};

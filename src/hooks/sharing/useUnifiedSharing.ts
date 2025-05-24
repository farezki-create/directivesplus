
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AccessCodeService, ValidationService, DocumentService } from "@/services/sharing";
import type { 
  ShareableDocument, 
  AccessCodeOptions,
  ValidationRequest,
  ValidationResult 
} from "@/services/sharing";

/**
 * Hook unifié pour toutes les opérations de partage
 */
export const useUnifiedSharing = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Génère un code d'accès personnel
   */
  const generatePersonalCode = async (
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await AccessCodeService.generateCode(document, {
        ...options,
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
      const result = await AccessCodeService.generateCode(document, {
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
  const validateCode = async (request: ValidationRequest): Promise<ValidationResult> => {
    setIsValidating(true);
    setError(null);
    
    try {
      const result = await ValidationService.validateCode(request);
      return result;
    } catch (err: any) {
      const errorResult = {
        success: false,
        error: err.message || "Erreur lors de la validation"
      };
      setError(errorResult.error);
      return errorResult;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Prolonge un code d'accès
   */
  const extendCode = async (accessCode: string, days: number = 365): Promise<boolean> => {
    setIsExtending(true);
    try {
      const result = await AccessCodeService.extendCode(accessCode, days);
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
   * Récupère les documents d'un utilisateur
   */
  const getUserDocuments = async (userId: string): Promise<ShareableDocument[]> => {
    try {
      return await DocumentService.getUserDocuments(userId);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  return {
    // État
    isGenerating,
    isValidating,
    isExtending,
    error,
    
    // Actions
    generatePersonalCode,
    generateInstitutionCode,
    validateCode,
    extendCode,
    getUserDocuments
  };
};

// Export des types pour compatibilité
export type { ShareableDocument, ValidationRequest, ValidationResult };

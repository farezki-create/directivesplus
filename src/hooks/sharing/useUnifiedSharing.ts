
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SharingService } from "./core/sharingService";
import type { ShareableDocument, AccessValidationResult } from "./types";

export const useUnifiedSharing = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Génère un code d'accès personnel
   */
  const generatePersonalCode = async (
    document: ShareableDocument,
    expiresInDays: number = 365
  ): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await SharingService.generateAccessCode(document, {
        expiresInDays,
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
   * Valide un code d'accès avec informations personnelles
   */
  const validateAccessCode = async (
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessValidationResult> => {
    try {
      return await SharingService.validateAccessCode(accessCode, personalInfo);
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Erreur lors de la validation"
      };
    }
  };

  /**
   * Prolonge un code d'accès
   */
  const extendAccessCode = async (
    accessCode: string,
    days: number = 365
  ): Promise<boolean> => {
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
    }
  };

  /**
   * Révoque un code d'accès
   */
  const revokeAccessCode = async (accessCode: string): Promise<boolean> => {
    try {
      const result = await SharingService.revokeAccessCode(accessCode);
      if (result.success) {
        toast({
          title: "Code révoqué",
          description: "Code d'accès révoqué avec succès"
        });
        return true;
      }
      return false;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de révoquer le code",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    // État
    isGenerating,
    error,
    
    // Actions
    generatePersonalCode,
    generateInstitutionCode,
    validateAccessCode,
    extendAccessCode,
    revokeAccessCode
  };
};

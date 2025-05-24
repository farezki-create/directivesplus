
import { CodeGenerationService } from "./codeGeneration";
import { TemporaryCodeService } from "./temporaryCodeService";
import { ValidationService } from "./validationService";
import type { AccessCodeOptions, AccessCodeValidation, PersonalInfo } from "./types";

/**
 * Gestionnaire unifié pour tous les codes d'accès
 * - Codes fixes basés sur l'ID utilisateur (permanents)
 * - Codes temporaires pour partage
 * - Un seul point d'entrée pour toute la gestion
 */
export class AccessCodeManager {
  /**
   * MÉTHODE PRINCIPALE : Obtenir le code d'accès d'un utilisateur
   * Retourne toujours le même code fixe pour un utilisateur donné
   */
  static getFixedAccessCode(userId: string): string {
    return CodeGenerationService.generateFixedCode(userId);
  }

  /**
   * MÉTHODE PRINCIPALE : Générer un code temporaire de partage
   * Crée un code temporaire avec expiration pour partager des documents
   */
  static async generateTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<{ success: boolean; code?: string; error?: string }> {
    return TemporaryCodeService.generateTemporaryCode(userId, options);
  }

  /**
   * MÉTHODE PRINCIPALE : Valider un code d'accès (fixe ou temporaire)
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> {
    return ValidationService.validateAccessCode(accessCode, personalInfo);
  }

  /**
   * MÉTHODE PRINCIPALE : Prolonger un code temporaire
   */
  static async extendTemporaryCode(
    accessCode: string, 
    additionalDays: number = 30
  ): Promise<{ success: boolean; error?: string }> {
    return TemporaryCodeService.extendTemporaryCode(accessCode, additionalDays);
  }

  /**
   * MÉTHODE PRINCIPALE : Révoquer un code temporaire
   */
  static async revokeTemporaryCode(accessCode: string): Promise<{ success: boolean; error?: string }> {
    return TemporaryCodeService.revokeTemporaryCode(accessCode);
  }
}

// Export des types pour utilisation externe
export type { AccessCodeOptions, AccessCodeValidation, PersonalInfo };

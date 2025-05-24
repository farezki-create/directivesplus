
import type { ShareableDocument, ShareOptions } from "../types";
import type { SharingResult, AccessValidationResult } from "./types";
import { AccessCodeGeneratorService } from "./services/accessCodeGenerator";
import { AccessCodeValidatorService } from "./services/accessCodeValidator";
import { AccessCodeManagerService } from "./services/accessCodeManager";

/**
 * Service central unifié pour toutes les opérations de partage
 * Remplace tous les services fragmentés existants
 */
export class UnifiedSharingService {
  
  /**
   * Génère un code d'accès pour un document (personnel ou institution)
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: ShareOptions & { accessType?: 'personal' | 'institution' } = {}
  ): Promise<SharingResult> {
    return AccessCodeGeneratorService.generateAccessCode(document, options);
  }

  /**
   * Valide un code d'accès et retourne les documents
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessValidationResult> {
    return AccessCodeValidatorService.validateAccessCode(accessCode, personalInfo);
  }

  /**
   * Prolonge un code d'accès existant
   */
  static async extendAccessCode(
    accessCode: string,
    additionalDays: number = 365
  ): Promise<SharingResult> {
    return AccessCodeManagerService.extendAccessCode(accessCode, additionalDays);
  }

  /**
   * Régénère un nouveau code d'accès
   */
  static async regenerateAccessCode(
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<SharingResult> {
    return AccessCodeManagerService.regenerateAccessCode(currentCode, expiresInDays);
  }

  /**
   * Révoque un code d'accès
   */
  static async revokeAccessCode(accessCode: string): Promise<SharingResult> {
    return AccessCodeManagerService.revokeAccessCode(accessCode);
  }
}

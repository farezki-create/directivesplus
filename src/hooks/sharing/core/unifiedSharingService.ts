
import type { ShareableDocument, ShareOptions } from "../types";
import type { SharingResult, AccessValidationResult } from "./types";
import { CodeGenerationService } from "./services/codeGenerationService";
import { CodeValidationService } from "./services/codeValidationService";
import { CodeManagementService } from "./services/codeManagementService";

/**
 * Service central unifié pour toutes les opérations de partage
 * Utilise maintenant une architecture modulaire avec des services spécialisés
 */
export class UnifiedSharingService {
  
  /**
   * Génère un code d'accès pour un document (personnel ou institution)
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: ShareOptions & { accessType?: 'personal' | 'institution' } = {}
  ): Promise<SharingResult> {
    const { accessType = 'personal' } = options;
    
    if (accessType === 'institution') {
      return CodeGenerationService.generateInstitutionCode(document, options);
    }
    
    return CodeGenerationService.generatePersonalCode(document, options);
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
    return CodeValidationService.validateCode(accessCode, personalInfo);
  }

  /**
   * Prolonge un code d'accès existant
   */
  static async extendAccessCode(
    accessCode: string,
    additionalDays: number = 365
  ): Promise<SharingResult> {
    return CodeManagementService.extendCode(accessCode, additionalDays);
  }

  /**
   * Régénère un nouveau code d'accès
   */
  static async regenerateAccessCode(
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<SharingResult> {
    return CodeManagementService.regenerateCode(currentCode, expiresInDays);
  }

  /**
   * Révoque un code d'accès
   */
  static async revokeAccessCode(accessCode: string): Promise<SharingResult> {
    return CodeManagementService.revokeCode(accessCode);
  }
}

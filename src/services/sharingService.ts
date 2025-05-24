
import { AccessCodeService, ValidationService, DocumentService } from "@/services/sharing";
import type { ShareableDocument, AccessValidationResult, SharingResult, ShareOptions } from "@/types/sharing";

/**
 * Service unifié pour la gestion du partage de documents (version simplifiée)
 * @deprecated Utiliser les services spécialisés dans @/services/sharing
 */
export class SharingService {
  /**
   * @deprecated Utiliser AccessCodeService.generateCode
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<SharingResult> {
    const result = await AccessCodeService.generateCode(document, {
      expiresInDays: options.expiresInDays,
      accessType: options.accessType === 'institution' ? 'institution' : 'personal'
    });
    
    return {
      success: result.success,
      code: result.code,
      error: result.error
    };
  }

  /**
   * @deprecated Utiliser ValidationService.validateCode
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessValidationResult> {
    const result = await ValidationService.validateCode({
      accessCode,
      personalInfo
    });
    
    return {
      success: result.success,
      documents: result.documents,
      message: result.message,
      error: result.error
    };
  }

  /**
   * @deprecated Utiliser AccessCodeService.extendCode
   */
  static async extendAccessCode(accessCode: string, days: number = 365): Promise<SharingResult> {
    const result = await AccessCodeService.extendCode(accessCode, days);
    return {
      success: result.success,
      error: result.error
    };
  }

  /**
   * @deprecated Utiliser AccessCodeService.revokeCode
   */
  static async revokeAccessCode(accessCode: string): Promise<SharingResult> {
    const result = await AccessCodeService.revokeCode(accessCode);
    return {
      success: result.success,
      error: result.error
    };
  }

  /**
   * @deprecated - Fonction non implémentée dans la nouvelle architecture
   */
  static async regenerateAccessCode(currentCode: string, days: number = 365): Promise<SharingResult> {
    // Cette fonction nécessiterait une logique plus complexe
    return {
      success: false,
      error: "Fonction non disponible - utilisez la nouvelle architecture"
    };
  }
}

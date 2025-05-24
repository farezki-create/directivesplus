
import type { ShareableDocument, ShareOptions } from "../../types";
import type { SharingResult } from "../types";
import { AccessCodeGeneratorService } from "./accessCodeGenerator";

/**
 * Service dédié à la génération de codes d'accès
 */
export class CodeGenerationService {
  /**
   * Génère un code d'accès personnel
   */
  static async generatePersonalCode(
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<SharingResult> {
    return AccessCodeGeneratorService.generateAccessCode(document, {
      ...options,
      accessType: 'personal'
    });
  }

  /**
   * Génère un code d'accès institutionnel
   */
  static async generateInstitutionCode(
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<SharingResult> {
    return AccessCodeGeneratorService.generateAccessCode(document, {
      ...options,
      accessType: 'institution'
    });
  }
}

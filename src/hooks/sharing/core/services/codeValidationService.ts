
import type { AccessValidationResult } from "../types";
import { AccessCodeValidatorService } from "./accessCodeValidator";

/**
 * Service dédié à la validation de codes d'accès
 */
export class CodeValidationService {
  /**
   * Valide un code d'accès avec informations personnelles optionnelles
   */
  static async validateCode(
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
   * Valide un code d'accès simple (sans vérification d'identité)
   */
  static async validateSimpleCode(accessCode: string): Promise<AccessValidationResult> {
    return AccessCodeValidatorService.validateAccessCode(accessCode);
  }
}

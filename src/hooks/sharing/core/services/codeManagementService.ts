
import type { SharingResult } from "../types";
import { AccessCodeManagerService } from "./accessCodeManager";

/**
 * Service dédié à la gestion des codes d'accès existants
 */
export class CodeManagementService {
  /**
   * Prolonge la validité d'un code d'accès
   */
  static async extendCode(
    accessCode: string,
    additionalDays: number = 365
  ): Promise<SharingResult> {
    return AccessCodeManagerService.extendAccessCode(accessCode, additionalDays);
  }

  /**
   * Régénère un nouveau code d'accès
   */
  static async regenerateCode(
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<SharingResult> {
    return AccessCodeManagerService.regenerateAccessCode(currentCode, expiresInDays);
  }

  /**
   * Révoque définitivement un code d'accès
   */
  static async revokeCode(accessCode: string): Promise<SharingResult> {
    return AccessCodeManagerService.revokeAccessCode(accessCode);
  }
}

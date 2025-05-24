
import type { ShareableDocument, ShareOptions } from "../../types";
import type { SharingResult, AccessValidationResult } from "../types";
import { AccessCodeGeneratorService } from "./accessCodeGenerator";
import { AccessCodeValidatorService } from "./accessCodeValidator";
import { AccessCodeManagerService } from "./accessCodeManager";

/**
 * Factory pour créer les services de partage appropriés
 */
export class SharingServiceFactory {
  /**
   * Crée le service de génération approprié selon le type d'accès
   */
  static getGeneratorService(): typeof AccessCodeGeneratorService {
    return AccessCodeGeneratorService;
  }

  /**
   * Crée le service de validation approprié
   */
  static getValidatorService(): typeof AccessCodeValidatorService {
    return AccessCodeValidatorService;
  }

  /**
   * Crée le service de gestion approprié
   */
  static getManagerService(): typeof AccessCodeManagerService {
    return AccessCodeManagerService;
  }
}


import { CodeGenerationService } from "./codeGeneration";
import { ValidationService } from "./validation";
import { DiagnosticService } from "./diagnostic";
import { CodeManagementService } from "./codeManagement";
import type { 
  PersonalInfo, 
  AccessCodeOptions, 
  AccessValidationResult, 
  CodeGenerationResult
} from "@/types/accessCode";

/**
 * Service unifié pour la gestion des codes d'accès
 * Orchestration des différents services spécialisés
 */
export class AccessCodeService {
  
  // ============ GÉNÉRATION DE CODES ============
  
  /**
   * Génère un code fixe reproductible basé sur l'ID utilisateur
   */
  static generateFixedCode(userId: string): string {
    return CodeGenerationService.generateFixedCode(userId);
  }

  /**
   * Génère un code temporaire unique
   */
  static generateTemporaryCode(): string {
    return CodeGenerationService.generateTemporaryCode();
  }

  // ============ DIAGNOSTIC ET DONNÉES DE TEST ============

  /**
   * Crée un utilisateur de test pour valider le système
   */
  static async createTestUser(): Promise<{ userId: string; fixedCode: string }> {
    return DiagnosticService.createTestUser();
  }

  /**
   * Effectue un diagnostic complet du système
   */
  static async diagnosticSystem(personalInfo: PersonalInfo): Promise<any> {
    return DiagnosticService.diagnosticSystem(personalInfo);
  }

  // ============ CRÉATION DE CODES D'ACCÈS ============

  /**
   * Crée un code d'accès temporaire pour un utilisateur
   */
  static async createTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<CodeGenerationResult> {
    return CodeManagementService.createTemporaryCode(userId, options);
  }

  // ============ VALIDATION DE CODES ============

  /**
   * Valide un code d'accès (temporaire ou fixe)
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS ===");
      console.log("Code:", accessCode, "Infos:", personalInfo);

      // Effectuer un diagnostic si échec prévu
      if (personalInfo) {
        console.log("🔍 Diagnostic avant validation...");
        const diagnostic = await DiagnosticService.diagnosticSystem(personalInfo);
        console.log("📊 Résultat diagnostic:", diagnostic);
      }

      // 1. Tentative code temporaire
      const temporaryResult = await ValidationService.validateTemporaryCode(accessCode, personalInfo);
      if (temporaryResult.success) {
        return temporaryResult;
      }

      // 2. Tentative code fixe (si infos personnelles fournies)
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const fixedResult = await ValidationService.validateFixedCode(accessCode, personalInfo);
        if (fixedResult.success) {
          return fixedResult;
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide ou expiré"
      };

    } catch (error: any) {
      console.error("💥 Erreur validation:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  // ============ GESTION DES CODES ============

  /**
   * Prolonge un code temporaire
   */
  static async extendCode(accessCode: string, additionalDays: number): Promise<CodeGenerationResult> {
    return CodeManagementService.extendCode(accessCode, additionalDays);
  }

  /**
   * Révoque un code temporaire
   */
  static async revokeCode(accessCode: string): Promise<CodeGenerationResult> {
    return CodeManagementService.revokeCode(accessCode);
  }
}

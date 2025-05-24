
import { CodeGenerationService } from "./codeGeneration";
import { ValidationService } from "./validation";
import { DiagnosticService } from "./diagnostic";
import { CodeManagementService } from "./codeManagement";
import { AnonymousValidationService } from "./anonymousValidation";
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
   * Valide un code d'accès (temporaire ou fixe) avec fallback anonyme
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS AMÉLIORÉE ===");
      console.log("Code:", accessCode, "Infos:", personalInfo);

      // 1. Tentative validation RPC si infos complètes
      if (personalInfo?.firstName && personalInfo?.lastName) {
        console.log("🔍 Tentative validation RPC...");
        const rpcResult = await AnonymousValidationService.validateViaRPC(accessCode, personalInfo);
        if (rpcResult.success) {
          console.log("✅ Validation RPC réussie");
          return rpcResult;
        }
      }

      // 2. Tentative validation anonyme via Edge Function
      console.log("🔍 Tentative validation anonyme...");
      const anonymousResult = await AnonymousValidationService.validateCodeAnonymously(accessCode, personalInfo);
      if (anonymousResult.success) {
        console.log("✅ Validation anonyme réussie");
        return anonymousResult;
      }

      // 3. Fallback vers validation classique (si utilisateur connecté)
      console.log("🔍 Fallback validation classique...");
      
      // Tentative code temporaire
      const temporaryResult = await ValidationService.validateTemporaryCode(accessCode, personalInfo);
      if (temporaryResult.success) {
        return temporaryResult;
      }

      // Tentative code fixe (si infos personnelles fournies)
      if (personalInfo?.firstName && personalInfo?.lastName) {
        const fixedResult = await ValidationService.validateFixedCode(accessCode, personalInfo);
        if (fixedResult.success) {
          return fixedResult;
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide ou expiré. Vérifiez que le code est correct et qu'il n'a pas expiré."
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

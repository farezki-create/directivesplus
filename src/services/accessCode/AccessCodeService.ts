
import { CodeGenerationService } from "./codeGeneration";
import { ValidationService } from "./validation";
import { DiagnosticService } from "./diagnostic";
import { CodeManagementService } from "./codeManagement";
import { SimpleValidationService } from "./simpleValidation";
import type { 
  PersonalInfo, 
  AccessCodeOptions, 
  AccessValidationResult, 
  CodeGenerationResult
} from "@/types/accessCode";

/**
 * Service unifié pour la gestion des codes d'accès
 * Version simplifiée avec logs détaillés
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

  // ============ VALIDATION DE CODES (SIMPLIFIÉE) ============

  /**
   * Valide un code d'accès avec logging détaillé
   */
  static async validateCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessValidationResult> {
    console.log("=== VALIDATION ACCESS CODE SERVICE ===");
    console.log("Code reçu:", accessCode);
    console.log("Infos reçues:", personalInfo);
    
    try {
      // Utiliser le service de validation simplifié
      const result = await SimpleValidationService.validateAccessCode(accessCode, personalInfo);
      
      console.log("=== RÉSULTAT FINAL ===");
      console.log("Succès:", result.success);
      console.log("Message:", result.message || result.error);
      console.log("Documents:", result.documents?.length || 0);
      
      return result;
      
    } catch (error: any) {
      console.error("💥 Erreur AccessCodeService:", error);
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

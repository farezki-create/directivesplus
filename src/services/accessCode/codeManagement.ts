
import { supabase } from "@/integrations/supabase/client";
import { CodeGenerationService } from "./codeGeneration";
import { DocumentRetrievalService } from "./documentRetrieval";
import type { AccessCodeOptions, CodeGenerationResult, DocumentBundle } from "@/types/accessCode";

/**
 * Service for creating and managing access codes
 */
export class CodeManagementService {
  /**
   * Crée un code d'accès temporaire pour un utilisateur
   */
  static async createTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<CodeGenerationResult> {
    try {
      console.log("=== CRÉATION CODE TEMPORAIRE ===");
      console.log("User ID:", userId, "Options:", options);

      // Récupérer les documents
      const documents = await DocumentRetrievalService.getUserDocuments(userId);
      if (documents.length === 0) {
        return {
          success: false,
          error: "Aucun document à partager trouvé"
        };
      }

      // Générer le code et calculer l'expiration
      const accessCode = CodeGenerationService.generateTemporaryCode();
      const expiresInDays = options.expiresInDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Préparer le bundle de documents
      const documentBundle: DocumentBundle = {
        userId,
        accessType: options.accessType || 'global',
        totalDocuments: documents.length,
        generatedAt: new Date().toISOString(),
        documents: documents.map(doc => ({
          ...doc,
          content: doc.content || null
        }))
      };

      // Enregistrer en base
      const { error } = await supabase
        .from('shared_documents')
        .insert({
          access_code: accessCode,
          user_id: userId,
          document_type: 'bundle',
          document_id: userId,
          document_data: documentBundle as any,
          expires_at: expiresAt.toISOString(),
          is_active: true
        });

      if (error) {
        console.error("❌ Erreur insertion:", error);
        return {
          success: false,
          error: `Erreur lors de l'enregistrement: ${error.message}`
        };
      }

      console.log("✅ Code temporaire créé:", accessCode);
      return {
        success: true,
        code: accessCode,
        message: `Code créé avec succès. Expire le ${expiresAt.toLocaleDateString()}.`,
        expiresAt: expiresAt.toISOString()
      };

    } catch (error: any) {
      console.error("💥 Erreur création code:", error);
      return {
        success: false,
        error: "Erreur technique lors de la création"
      };
    }
  }

  /**
   * Prolonge un code temporaire
   */
  static async extendCode(accessCode: string, additionalDays: number): Promise<CodeGenerationResult> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

      const { error } = await supabase
        .from('shared_documents')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('access_code', accessCode)
        .eq('is_active', true);

      if (error) {
        return { success: false, error: "Code non trouvé ou erreur" };
      }

      return {
        success: true,
        message: `Code prolongé jusqu'au ${newExpiresAt.toLocaleDateString()}`,
        expiresAt: newExpiresAt.toISOString()
      };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la prolongation" };
    }
  }

  /**
   * Révoque un code temporaire
   */
  static async revokeCode(accessCode: string): Promise<CodeGenerationResult> {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode);

      if (error) {
        return { success: false, error: "Erreur lors de la révocation" };
      }

      return { success: true, message: "Code révoqué avec succès" };

    } catch (error: any) {
      return { success: false, error: "Erreur lors de la révocation" };
    }
  }
}

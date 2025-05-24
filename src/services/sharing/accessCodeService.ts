
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, AccessCodeOptions, AccessCodeResult } from "@/types/sharing";

/**
 * Service de gestion des codes d'accès
 */
export class AccessCodeService {
  /**
   * Génère un nouveau code d'accès
   */
  static async generateCode(
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      const { expiresInDays = 365, accessType = 'personal' } = options;
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      const documentData = {
        id: document.id,
        file_name: document.file_name,
        file_path: document.file_path,
        created_at: document.created_at,
        user_id: document.user_id,
        file_type: document.file_type,
        source: document.source,
        content: document.content,
        description: document.description,
        content_type: document.content_type,
        is_private: document.is_private,
        external_id: document.external_id,
        file_size: document.file_size,
        updated_at: document.updated_at
      };

      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: document.id,
          document_type: document.source,
          document_data: documentData,
          user_id: document.user_id,
          expires_at: expiresAt.toISOString()
        })
        .select('access_code')
        .single();

      if (error) {
        console.error("Erreur génération code:", error);
        return { success: false, error: error.message };
      }

      if (!data?.access_code) {
        return { success: false, error: "Code d'accès non généré" };
      }

      return { success: true, code: data.access_code };
    } catch (error: any) {
      console.error("Erreur AccessCodeService.generateCode:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Prolonge la validité d'un code
   */
  static async extendCode(accessCode: string, days: number = 365): Promise<AccessCodeResult> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + days);

      const { error } = await supabase
        .from('shared_documents')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('access_code', accessCode)
        .eq('is_active', true);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Révoque un code d'accès
   */
  static async revokeCode(accessCode: string): Promise<AccessCodeResult> {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Régénère un code d'accès en révoquant l'ancien et en créant un nouveau
   */
  static async regenerateCode(
    currentCode: string, 
    document: ShareableDocument, 
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      // Révoquer l'ancien code
      const revokeResult = await this.revokeCode(currentCode);
      if (!revokeResult.success) {
        return { success: false, error: "Impossible de révoquer l'ancien code" };
      }

      // Générer un nouveau code
      const newCodeResult = await this.generateCode(document, options);
      return newCodeResult;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

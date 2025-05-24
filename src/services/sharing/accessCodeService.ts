
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, AccessCodeOptions, AccessCodeResult } from "@/types/sharing";

/**
 * Service de gestion des codes d'accès
 */
export class AccessCodeService {
  /**
   * Génère un nouveau code d'accès global pour tous les documents de l'utilisateur
   */
  static async generateGlobalCode(
    userId: string,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      const { expiresInDays = 365, accessType = 'personal' } = options;
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      // Récupérer tous les documents de l'utilisateur
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId);

      const { data: medicalDocs, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      if (pdfError || directivesError || medicalError) {
        console.error("Erreur récupération documents:", { pdfError, directivesError, medicalError });
        return { success: false, error: "Erreur lors de la récupération des documents" };
      }

      // Créer une entrée globale dans shared_documents avec tous les documents
      const allDocuments = [
        ...(pdfDocs || []).map(doc => ({ ...doc, source: 'pdf_documents', file_type: 'pdf' })),
        ...(directives || []).map(doc => ({ ...doc, source: 'directives', file_type: 'directive' })),
        ...(medicalDocs || []).map(doc => ({ ...doc, source: 'medical_documents', file_type: 'medical' }))
      ];

      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: `global-${userId}`, // ID global pour tous les documents
          document_type: 'global_access',
          document_data: {
            access_type: 'global',
            user_id: userId,
            documents: allDocuments
          },
          user_id: userId,
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
      console.error("Erreur AccessCodeService.generateGlobalCode:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Génère un nouveau code d'accès pour un document spécifique (legacy)
   */
  static async generateCode(
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    // Rediriger vers la génération globale
    return this.generateGlobalCode(document.user_id, options);
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
   * Régénère un code d'accès global
   */
  static async regenerateGlobalCode(
    currentCode: string, 
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      // Révoquer l'ancien code
      const revokeResult = await this.revokeCode(currentCode);
      if (!revokeResult.success) {
        return { success: false, error: "Impossible de révoquer l'ancien code" };
      }

      // Générer un nouveau code global
      const newCodeResult = await this.generateGlobalCode(userId, options);
      return newCodeResult;
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
    // Rediriger vers la régénération globale
    return this.regenerateGlobalCode(currentCode, document.user_id, options);
  }
}

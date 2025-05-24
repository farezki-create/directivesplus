
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
      
      // Récupérer tous les documents de l'utilisateur avec structure normalisée
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

      // Normaliser la structure des documents pour assurer la cohérence
      const normalizedDocuments = [
        ...(pdfDocs || []).map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          created_at: doc.created_at,
          user_id: doc.user_id || userId,
          file_type: 'pdf',
          source: 'pdf_documents',
          description: doc.description || 'Document PDF',
          content_type: doc.content_type || 'application/pdf',
          is_private: false,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at || doc.created_at
        })),
        ...(directives || []).map(doc => ({
          id: doc.id,
          file_name: `Directive - ${new Date(doc.created_at).toLocaleDateString()}`,
          file_path: `directive-${doc.id}`,
          created_at: doc.created_at,
          user_id: doc.user_id,
          file_type: 'directive',
          source: 'directives',
          content: doc.content,
          description: 'Directive anticipée',
          content_type: 'application/json',
          is_private: false,
          updated_at: doc.updated_at || doc.created_at
        })),
        ...(medicalDocs || []).map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          created_at: doc.created_at,
          user_id: doc.user_id,
          file_type: 'medical',
          source: 'medical_documents',
          description: doc.description || 'Document médical',
          content_type: doc.file_type || 'application/pdf',
          is_private: false,
          file_size: doc.file_size,
          updated_at: doc.created_at
        }))
      ];

      console.log(`Génération code global: ${normalizedDocuments.length} documents trouvés pour l'utilisateur ${userId}`);

      // Créer l'entrée dans shared_documents avec structure simplifiée
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: userId, // Utiliser directement l'userId comme document_id
          document_type: 'global_access',
          document_data: {
            access_type: 'global',
            user_id: userId,
            total_documents: normalizedDocuments.length,
            documents: normalizedDocuments
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

      console.log(`Code d'accès global généré: ${data.access_code} pour ${normalizedDocuments.length} documents`);
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

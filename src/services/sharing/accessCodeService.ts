
import { supabase } from "@/integrations/supabase/client";
import type { 
  ShareableDocument, 
  AccessCodeOptions, 
  AccessCodeResult,
  GlobalAccessData
} from "@/types/sharing";

/**
 * Service de gestion des codes d'accès - Version refactorisée
 */
export class AccessCodeService {
  /**
   * Normalise un document selon sa source
   */
  private static normalizeDocument(doc: any, source: string): ShareableDocument {
    const baseDoc = {
      id: doc.id,
      user_id: doc.user_id,
      created_at: doc.created_at,
      updated_at: doc.updated_at || doc.created_at,
      is_private: false
    };

    switch (source) {
      case 'pdf_documents':
        return {
          ...baseDoc,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_type: 'pdf' as const,
          source: 'pdf_documents' as const,
          description: doc.description || 'Document PDF',
          content_type: doc.content_type || 'application/pdf',
          external_id: doc.external_id,
          file_size: doc.file_size
        };
      
      case 'directives':
        return {
          ...baseDoc,
          file_name: `Directive - ${new Date(doc.created_at).toLocaleDateString()}`,
          file_path: `directive-${doc.id}`,
          file_type: 'directive' as const,
          source: 'directives' as const,
          content: doc.content,
          description: 'Directive anticipée',
          content_type: 'application/json'
        };
      
      case 'medical_documents':
        return {
          ...baseDoc,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_type: 'medical' as const,
          source: 'medical_documents' as const,
          description: doc.description || 'Document médical',
          content_type: doc.file_type || 'application/pdf',
          file_size: doc.file_size
        };
      
      default:
        throw new Error(`Source de document inconnue: ${source}`);
    }
  }

  /**
   * Récupère tous les documents d'un utilisateur
   */
  private static async fetchAllUserDocuments(userId: string): Promise<ShareableDocument[]> {
    const results = await Promise.allSettled([
      supabase.from('pdf_documents').select('*').eq('user_id', userId),
      supabase.from('directives').select('*').eq('user_id', userId),
      supabase.from('medical_documents').select('*').eq('user_id', userId)
    ]);

    const allDocuments: ShareableDocument[] = [];
    const sources = ['pdf_documents', 'directives', 'medical_documents'];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error && result.value.data) {
        const docs = result.value.data.map(doc => 
          this.normalizeDocument(doc, sources[index])
        );
        allDocuments.push(...docs);
      } else if (result.status === 'rejected' || result.value.error) {
        console.warn(`Erreur lors de la récupération des ${sources[index]}:`, 
          result.status === 'rejected' ? result.reason : result.value.error);
      }
    });

    return allDocuments;
  }

  /**
   * Génère un nouveau code d'accès global pour tous les documents de l'utilisateur
   */
  static async generateGlobalCode(
    userId: string,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    try {
      const { expiresInDays = 365 } = options;
      
      console.log(`Génération code global pour utilisateur: ${userId}`);
      
      // Récupérer tous les documents de l'utilisateur
      const allDocuments = await this.fetchAllUserDocuments(userId);
      
      console.log(`${allDocuments.length} documents récupérés pour l'utilisateur ${userId}`);

      if (allDocuments.length === 0) {
        return {
          success: false,
          error: "Aucun document trouvé pour cet utilisateur"
        };
      }

      // Créer la structure de données globales
      const globalData: GlobalAccessData = {
        access_type: 'global',
        user_id: userId,
        total_documents: allDocuments.length,
        generated_at: new Date().toISOString(),
        documents: allDocuments
      };

      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Créer l'entrée dans shared_documents avec conversion explicite vers Json
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: userId, // Utiliser userId comme document_id pour l'accès global
          document_type: 'global_access',
          document_data: globalData as any, // Conversion explicite vers Json
          user_id: userId,
          expires_at: expiresAt.toISOString()
        })
        .select('access_code')
        .single();

      if (error) {
        console.error("Erreur génération code:", error);
        return { 
          success: false, 
          error: `Erreur lors de la génération: ${error.message}` 
        };
      }

      if (!data?.access_code) {
        return { 
          success: false, 
          error: "Code d'accès non généré" 
        };
      }

      console.log(`Code d'accès global généré: ${data.access_code} pour ${allDocuments.length} documents`);
      
      return { 
        success: true, 
        code: data.access_code 
      };

    } catch (error: any) {
      console.error("Erreur AccessCodeService.generateGlobalCode:", error);
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }

  /**
   * Génère un nouveau code d'accès pour un document spécifique (legacy - redirige vers global)
   */
  static async generateCode(
    document: ShareableDocument,
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
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
        return { 
          success: false, 
          error: `Erreur lors de la prolongation: ${error.message}` 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
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
        return { 
          success: false, 
          error: `Erreur lors de la révocation: ${error.message}` 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
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
        return { 
          success: false, 
          error: `Impossible de révoquer l'ancien code: ${revokeResult.error}` 
        };
      }

      // Générer un nouveau code global
      return await this.generateGlobalCode(userId, options);
    } catch (error: any) {
      return { 
        success: false, 
        error: `Erreur lors de la régénération: ${error.message}` 
      };
    }
  }

  /**
   * Régénère un code d'accès (legacy - redirige vers global)
   */
  static async regenerateCode(
    currentCode: string, 
    document: ShareableDocument, 
    options: AccessCodeOptions = {}
  ): Promise<AccessCodeResult> {
    return this.regenerateGlobalCode(currentCode, document.user_id, options);
  }
}

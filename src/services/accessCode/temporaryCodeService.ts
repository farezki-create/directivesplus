
import { supabase } from "@/integrations/supabase/client";
import { DocumentRetrievalService } from "./documentRetrieval";
import type { AccessCodeOptions, TemporaryAccessData } from "./types";

/**
 * Service pour la gestion des codes temporaires
 */
export class TemporaryCodeService {
  /**
   * Générer un code temporaire de partage
   */
  static async generateTemporaryCode(
    userId: string, 
    options: AccessCodeOptions = {}
  ): Promise<{ success: boolean; code?: string; error?: string }> {
    try {
      console.log("=== GÉNÉRATION CODE TEMPORAIRE ===");
      console.log("User ID:", userId);
      console.log("Options:", options);
      
      const { expiresInDays = 30 } = options;
      
      // Récupérer tous les documents de l'utilisateur
      const documents = await DocumentRetrievalService.getUserDocuments(userId);
      console.log("Documents trouvés:", documents.length);
      
      if (documents.length === 0) {
        console.warn("Aucun document trouvé pour l'utilisateur:", userId);
        return {
          success: false,
          error: "Aucun document trouvé pour générer un code de partage"
        };
      }

      // Créer la structure de données compatible avec Json
      const shareData: TemporaryAccessData = {
        access_type: 'temporary',
        user_id: userId,
        total_documents: documents.length,
        generated_at: new Date().toISOString(),
        documents: documents.map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          created_at: doc.created_at,
          user_id: doc.user_id,
          file_type: doc.file_type,
          source: doc.source,
          description: doc.description || '',
          content_type: doc.content_type || '',
          content: doc.content,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at,
          is_private: doc.is_private
        }))
      };

      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      console.log("Date d'expiration:", expiresAt.toISOString());

      console.log("Insertion dans shared_documents...");
      
      // Créer l'entrée dans shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: userId,
          document_type: 'temporary_access',
          document_data: shareData as any,
          user_id: userId,
          expires_at: expiresAt.toISOString()
        })
        .select('access_code, id, shared_at')
        .single();

      if (error) {
        console.error("Erreur lors de l'insertion:", error);
        return { 
          success: false, 
          error: `Erreur lors de la génération: ${error.message}` 
        };
      }

      if (!data || !data.access_code) {
        console.error("Aucune donnée retournée après insertion");
        return {
          success: false,
          error: "Erreur: aucun code d'accès généré"
        };
      }

      console.log("✅ PARTAGE ENREGISTRÉ AVEC SUCCÈS");
      console.log("Code d'accès généré:", data.access_code);
      console.log("ID d'enregistrement:", data.id);
      console.log("Date de partage:", data.shared_at);
      console.log("Nombre de documents partagés:", documents.length);

      // Vérification supplémentaire : confirmer que l'enregistrement existe
      const { data: verification, error: verifyError } = await supabase
        .from('shared_documents')
        .select('id, access_code, is_active, expires_at')
        .eq('access_code', data.access_code)
        .single();

      if (verifyError || !verification) {
        console.error("Erreur lors de la vérification:", verifyError);
        return {
          success: false,
          error: "Erreur: impossible de vérifier l'enregistrement"
        };
      }

      console.log("✅ VÉRIFICATION CONFIRMÉE");
      console.log("Enregistrement vérifié:", verification);

      return { 
        success: true, 
        code: data.access_code 
      };

    } catch (error: any) {
      console.error("Erreur technique lors de la génération:", error);
      return { 
        success: false, 
        error: `Erreur technique: ${error.message}` 
      };
    }
  }

  /**
   * Prolonger un code temporaire
   */
  static async extendTemporaryCode(
    accessCode: string, 
    additionalDays: number = 30
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

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
   * Révoquer un code temporaire
   */
  static async revokeTemporaryCode(accessCode: string): Promise<{ success: boolean; error?: string }> {
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
}

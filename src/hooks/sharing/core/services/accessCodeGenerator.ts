
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions } from "../../types";
import type { SharingResult } from "../types";
import { determineDocumentType } from "../utils/documentTypeUtils";

/**
 * Service pour la génération de codes d'accès
 */
export class AccessCodeGeneratorService {
  /**
   * Génère un code d'accès pour un document (personnel ou institution)
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: ShareOptions & { accessType?: 'personal' | 'institution' } = {}
  ): Promise<SharingResult> {
    try {
      const { accessType = 'personal', expiresInDays = 365 } = options;
      
      console.log("=== GÉNÉRATION CODE D'ACCÈS ===");
      console.log("Document:", { id: document.id, source: document.source, file_type: document.file_type });
      console.log("Options:", { accessType, expiresInDays });
      
      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Déterminer le type de document pour la contrainte DB
      const documentType = determineDocumentType(document);
      
      console.log("Type de document déterminé:", documentType);

      // Créer l'entrée dans shared_documents (source unique de vérité)
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          user_id: document.user_id,
          document_id: document.id,
          document_type: documentType,
          document_data: {
            ...document,
            access_type: accessType
          } as any,
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select('access_code')
        .single();

      if (error) {
        console.error("Erreur génération code:", error);
        return { success: false, error: error.message };
      }

      console.log("Code généré avec succès:", data.access_code);
      return { success: true, code: data.access_code };
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      return { success: false, error: error.message };
    }
  }
}


import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions, SharingResult, AccessValidationResult } from "../types";

/**
 * Service principal pour toutes les opérations de partage
 * Interface simple et unifiée avec Supabase
 */
export class SharingService {
  /**
   * Génère un code d'accès pour un document
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<SharingResult> {
    try {
      const { expiresInDays = 365, accessType = 'personal' } = options;
      
      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Déterminer le type de document pour la contrainte DB
      let documentType = 'directives';
      if (document.source === 'pdf_documents' || document.file_type === 'pdf') {
        documentType = 'pdf_documents';
      } else if (document.source === 'medical_documents' || document.file_type === 'medical') {
        documentType = 'medical_documents';
      }

      // Créer l'entrée dans shared_documents
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

      return { success: true, code: data.access_code };
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Valide un code d'accès et retourne les documents
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessValidationResult> {
    try {
      console.log("Validation code d'accès:", { accessCode, hasPersonalInfo: !!personalInfo });

      const { data, error } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: accessCode,
          input_first_name: personalInfo?.firstName || null,
          input_last_name: personalInfo?.lastName || null,
          input_birth_date: personalInfo?.birthDate || null
        }
      );

      if (error) {
        console.error("Erreur validation:", error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { 
          success: false, 
          error: "Code d'accès invalide ou informations incorrectes" 
        };
      }

      console.log("Validation réussie:", data.length, "document(s) trouvé(s)");
      return { success: true, documents: data };
    } catch (error: any) {
      console.error("Erreur validation:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Prolonge un code d'accès existant
   */
  static async extendAccessCode(
    accessCode: string,
    additionalDays: number = 365
  ): Promise<SharingResult> {
    try {
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

      const { data, error } = await supabase
        .from('shared_documents')
        .update({ 
          expires_at: newExpiryDate.toISOString(),
          shared_at: new Date().toISOString()
        })
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .select('access_code')
        .single();

      if (error || !data) {
        return { success: false, error: "Code d'accès introuvable ou expiré" };
      }

      return { success: true, code: data.access_code };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Régénère un nouveau code d'accès
   */
  static async regenerateAccessCode(
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<SharingResult> {
    try {
      // Récupérer le document existant
      const { data: existingDoc, error: fetchError } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', currentCode)
        .eq('is_active', true)
        .single();

      if (fetchError || !existingDoc) {
        return { success: false, error: "Document partagé introuvable" };
      }

      // Désactiver l'ancien code
      await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', currentCode);

      // Créer un nouveau partage
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          user_id: existingDoc.user_id,
          document_id: existingDoc.document_id,
          document_type: existingDoc.document_type,
          document_data: existingDoc.document_data,
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select('access_code')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, code: data.access_code };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Révoque un code d'accès
   */
  static async revokeAccessCode(accessCode: string): Promise<SharingResult> {
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
}

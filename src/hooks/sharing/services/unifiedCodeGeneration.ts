
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions } from "../types";

export interface CodeGenerationResult {
  success: boolean;
  code?: string;
  error?: string;
}

/**
 * Service unifié pour la génération de codes d'accès
 * Remplace les multiples services fragmentés
 */
export class UnifiedCodeGenerationService {
  
  /**
   * Génère un code d'accès personnel pour un document
   */
  static async generatePersonalCode(
    document: ShareableDocument,
    options: ShareOptions = {}
  ): Promise<CodeGenerationResult> {
    try {
      console.log("Génération code personnel:", { document: document.id, options });
      
      const expiryDays = options.expiresInDays || 365;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      // Utiliser shared_documents comme source unique
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          user_id: document.user_id,
          document_id: document.id,
          document_type: document.source === 'directives' ? 'directives' : 'pdf_documents',
          document_data: {
            ...document,
            access_type: 'personal'
          },
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select('access_code')
        .single();

      if (error) {
        console.error("Erreur génération code personnel:", error);
        return { success: false, error: error.message };
      }

      return { success: true, code: data.access_code };
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Génère un code d'accès institution pour directives
   */
  static async generateInstitutionCode(
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<CodeGenerationResult> {
    try {
      console.log("Génération code institution:", { document: document.id, expiresInDays });
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      // Créer une entrée dans shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          user_id: document.user_id,
          document_id: document.id,
          document_type: 'directives',
          document_data: {
            ...document,
            access_type: 'institution'
          },
          expires_at: expiresAt.toISOString(),
          is_active: true
        })
        .select('access_code')
        .single();

      if (error) {
        console.error("Erreur génération code institution:", error);
        return { success: false, error: error.message };
      }

      // Optionnel: Maintenir la compatibilité avec l'ancien système
      await supabase
        .from('directives')
        .update({
          institution_code: data.access_code,
          institution_code_expires_at: expiresAt.toISOString()
        })
        .eq('id', document.id);

      return { success: true, code: data.access_code };
    } catch (error: any) {
      console.error("Erreur inattendue génération institution:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Prolonge un code d'accès existant
   */
  static async extendCode(
    accessCode: string,
    additionalDays: number = 365
  ): Promise<CodeGenerationResult> {
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
  static async regenerateCode(
    currentCode: string,
    expiresInDays: number = 365
  ): Promise<CodeGenerationResult> {
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
}

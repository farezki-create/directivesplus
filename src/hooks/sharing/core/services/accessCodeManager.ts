
import { supabase } from "@/integrations/supabase/client";
import type { SharingResult } from "../types";

/**
 * Service pour la gestion des codes d'accès (prolongation, régénération, révocation)
 */
export class AccessCodeManagerService {
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

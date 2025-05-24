
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, SharingResult, AccessValidationResult } from "../types";

export class SharingService {
  /**
   * Génère un code d'accès pour un document
   */
  static async generateAccessCode(
    document: ShareableDocument,
    options: {
      expiresInDays?: number;
      accessType?: 'personal' | 'institution';
    } = {}
  ): Promise<SharingResult> {
    try {
      const { expiresInDays = 365, accessType = 'institution' } = options;
      
      // Calculer la date d'expiration
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      
      console.log("SharingService.generateAccessCode - Création document partagé:", {
        document_id: document.id,
        document_type: document.source,
        user_id: document.user_id,
        expires_at: expiresAt.toISOString()
      });

      // Insérer dans shared_documents
      const { data, error } = await supabase
        .from('shared_documents')
        .insert({
          document_id: document.id,
          document_type: document.source,
          document_data: document,
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

      return {
        success: true,
        code: data.access_code
      };
    } catch (error: any) {
      console.error("Erreur SharingService.generateAccessCode:", error);
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
      console.log("SharingService.validateAccessCode:", { accessCode, personalInfo });

      // Utiliser la fonction RPC existante
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
        console.error("Erreur RPC validation:", error);
        return {
          success: false,
          error: "Erreur lors de la vérification du code d'accès"
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: "Code d'accès invalide ou expiré"
        };
      }

      // Transformer les données brutes en ShareableDocument
      const documents: ShareableDocument[] = data.map((item: any) => {
        const docData = item.document_data;
        return {
          id: item.document_id,
          file_name: docData?.file_name || 'Document',
          file_path: docData?.file_path || '',
          created_at: docData?.created_at || item.shared_at,
          user_id: item.user_id,
          file_type: (docData?.file_type || 'directive') as 'directive' | 'pdf' | 'medical',
          source: (docData?.source || item.document_type) as 'pdf_documents' | 'directives' | 'medical_documents',
          content: docData?.content,
          description: docData?.description,
          content_type: docData?.content_type,
          is_private: docData?.is_private,
          external_id: docData?.external_id,
          file_size: docData?.file_size,
          updated_at: docData?.updated_at
        };
      });

      return {
        success: true,
        documents,
        message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
      };

    } catch (error: any) {
      console.error("Erreur SharingService.validateAccessCode:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Prolonge la validité d'un code d'accès
   */
  static async extendAccessCode(accessCode: string, days: number = 365): Promise<SharingResult> {
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

  /**
   * Régénère un nouveau code d'accès
   */
  static async regenerateAccessCode(currentCode: string, days: number = 365): Promise<SharingResult> {
    try {
      // D'abord récupérer le document associé
      const { data: currentDoc, error: fetchError } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', currentCode)
        .eq('is_active', true)
        .single();

      if (fetchError || !currentDoc) {
        return { success: false, error: "Code d'accès introuvable" };
      }

      // Désactiver l'ancien code
      await this.revokeAccessCode(currentCode);

      // Créer un nouveau document partagé
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + days);

      const { data: newDoc, error: createError } = await supabase
        .from('shared_documents')
        .insert({
          document_id: currentDoc.document_id,
          document_type: currentDoc.document_type,
          document_data: currentDoc.document_data,
          user_id: currentDoc.user_id,
          expires_at: newExpiresAt.toISOString()
        })
        .select('access_code')
        .single();

      if (createError || !newDoc?.access_code) {
        return { success: false, error: "Impossible de générer un nouveau code" };
      }

      return {
        success: true,
        code: newDoc.access_code
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

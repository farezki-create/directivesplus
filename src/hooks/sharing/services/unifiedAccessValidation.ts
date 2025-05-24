
import { supabase } from "@/integrations/supabase/client";
import type { AccessCodeValidationResult } from "../types";

/**
 * Service unifié pour la validation des codes d'accès
 */
export class UnifiedAccessValidationService {
  
  /**
   * Valide un code d'accès et retourne les documents associés
   */
  static async validateAccessCode(
    accessCode: string,
    patientInfo?: {
      firstName?: string;
      lastName?: string;
      birthDate?: string;
    }
  ): Promise<AccessCodeValidationResult> {
    try {
      console.log("Validation code d'accès:", { accessCode, patientInfo });

      // Utiliser la fonction RPC existante qui est déjà testée
      const { data, error } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: accessCode,
          input_first_name: patientInfo?.firstName || null,
          input_last_name: patientInfo?.lastName || null,
          input_birth_date: patientInfo?.birthDate || null
        }
      );

      if (error) {
        console.error("Erreur RPC validation:", error);
        return {
          success: false,
          message: "Erreur lors de la vérification du code d'accès"
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          message: "Code d'accès invalide ou expiré"
        };
      }

      // Récupérer les informations du patient si nécessaire
      let patientData = undefined;
      if (data[0].user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, birth_date')
          .eq('id', data[0].user_id)
          .single();

        if (profileData) {
          patientData = {
            user_id: data[0].user_id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            birth_date: profileData.birth_date
          };
        }
      }

      // Transformer les données en format unifié
      const documents = data.map(doc => ({
        id: doc.document_id,
        ...doc.document_data,
        shared_at: doc.shared_at
      }));

      return {
        success: true,
        message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`,
        documents,
        patientData
      };

    } catch (error: any) {
      console.error("Erreur validation accès:", error);
      return {
        success: false,
        message: "Erreur technique lors de la validation"
      };
    }
  }

  /**
   * Valide spécifiquement l'accès institution avec vérification d'identité
   */
  static async validateInstitutionAccess(
    lastName: string,
    firstName: string,
    birthDate: string,
    accessCode: string
  ): Promise<AccessCodeValidationResult> {
    return this.validateAccessCode(accessCode, {
      firstName,
      lastName,
      birthDate
    });
  }

  /**
   * Vérifie si un code d'accès est valide (sans retourner les documents)
   */
  static async isValidAccessCode(accessCode: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('shared_documents')
        .select('id')
        .eq('access_code', accessCode)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  /**
   * Révoque un code d'accès
   */
  static async revokeAccessCode(accessCode: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('access_code', accessCode);

      return !error;
    } catch {
      return false;
    }
  }
}

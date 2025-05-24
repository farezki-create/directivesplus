
import { supabase } from "@/integrations/supabase/client";
import type { AccessValidationResult } from "../types";

/**
 * Service pour la validation des codes d'accès
 */
export class AccessCodeValidatorService {
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
}


import { supabase } from "@/integrations/supabase/client";
import type { 
  ShareableDocument, 
  ValidationRequest, 
  ValidationResult,
  SupabaseSharedDocumentResponse,
  GlobalAccessData
} from "@/types/sharing";

/**
 * Service de validation des codes d'accès - Version refactorisée
 */
export class ValidationService {
  /**
   * Valide un code d'accès et retourne les documents
   */
  static async validateCode(request: ValidationRequest): Promise<ValidationResult> {
    try {
      console.log("ValidationService.validateCode - Début validation:", {
        accessCode: request.accessCode,
        hasPersonalInfo: !!request.personalInfo
      });

      const { data, error } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: request.accessCode,
          input_first_name: request.personalInfo?.firstName || null,
          input_last_name: request.personalInfo?.lastName || null,
          input_birth_date: request.personalInfo?.birthDate || null
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
        console.log("Aucune donnée retournée pour le code:", request.accessCode);
        return {
          success: false,
          error: "Code d'accès invalide ou expiré"
        };
      }

      console.log("Données brutes reçues:", data);

      // Traitement avec typage strict
      const responseData = data[0] as SupabaseSharedDocumentResponse;
      
      if (!responseData.document_data) {
        console.error("Aucune donnée de document trouvée");
        return {
          success: false,
          error: "Structure de données invalide"
        };
      }

      // Conversion sécurisée vers GlobalAccessData
      const globalData = responseData.document_data as GlobalAccessData;
      
      // Validation de la structure
      if (globalData.access_type !== 'global' || !Array.isArray(globalData.documents)) {
        console.error("Structure de données globales invalide:", globalData);
        return {
          success: false,
          error: "Format de données invalide"
        };
      }

      console.log(`Documents extraits: ${globalData.documents.length} documents trouvés`);
      console.log("Documents détails:", globalData.documents.map(d => ({ 
        name: d.file_name, 
        type: d.file_type,
        source: d.source 
      })));

      return {
        success: true,
        documents: globalData.documents,
        message: `Accès autorisé. ${globalData.documents.length} document(s) trouvé(s).`
      };

    } catch (error: any) {
      console.error("Erreur ValidationService.validateCode:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }
}

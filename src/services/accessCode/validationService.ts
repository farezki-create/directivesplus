
import { supabase } from "@/integrations/supabase/client";
import { DocumentRetrievalService } from "./documentRetrieval";
import { CodeGenerationService } from "./codeGeneration";
import type { AccessCodeValidation, PersonalInfo } from "./types";
import type { ShareableDocument } from "@/types/sharing";

/**
 * Service pour la validation des codes d'accès
 */
export class ValidationService {
  /**
   * Valider un code d'accès (fixe ou temporaire)
   */
  static async validateAccessCode(
    accessCode: string,
    personalInfo?: PersonalInfo
  ): Promise<AccessCodeValidation> {
    try {
      console.log("=== VALIDATION CODE D'ACCÈS UNIFIÉ ===");
      console.log("Code:", accessCode);
      console.log("Infos personnelles:", !!personalInfo);

      // 1. D'abord essayer avec les codes temporaires via RPC
      if (personalInfo) {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'get_shared_documents_by_access_code',
          {
            input_access_code: accessCode,
            input_first_name: personalInfo.firstName,
            input_last_name: personalInfo.lastName,
            input_birth_date: personalInfo.birthDate
          }
        );

        if (!rpcError && rpcData && rpcData.length > 0) {
          const responseData = rpcData[0];
          
          // Vérification du type et accès sécurisé aux propriétés
          if (responseData.document_data && typeof responseData.document_data === 'object') {
            const documentData = responseData.document_data as any;
            if (documentData.documents && Array.isArray(documentData.documents)) {
              return {
                success: true,
                documents: documentData.documents as ShareableDocument[],
                message: `Accès autorisé. ${documentData.documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      // 2. Ensuite essayer avec les codes fixes
      if (personalInfo) {
        console.log("Tentative avec codes fixes");
        
        // Rechercher le profil utilisateur
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName)
          .ilike('last_name', personalInfo.lastName);

        if (!profileError && profiles && profiles.length > 0) {
          for (const profile of profiles) {
            // Vérifier si la date de naissance correspond (si fournie)
            if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
              continue;
            }

            const expectedCode = CodeGenerationService.generateFixedCode(profile.id);
            console.log("Code attendu pour", profile.first_name, profile.last_name, ":", expectedCode);
            
            if (expectedCode === accessCode) {
              console.log("Code fixe validé pour l'utilisateur:", profile.id);
              
              const documents = await DocumentRetrievalService.getUserDocuments(profile.id);
              
              return {
                success: true,
                documents: documents,
                message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
              };
            }
          }
        }
      }

      return {
        success: false,
        error: "Code d'accès invalide ou informations incorrectes"
      };

    } catch (error: any) {
      console.error("Erreur validation code:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }
}

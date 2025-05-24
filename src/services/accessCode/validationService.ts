
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
      console.log("=== VALIDATION CODE D'ACCÈS UNIFIÉ - DEBUG ===");
      console.log("Code reçu:", accessCode);
      console.log("Infos personnelles reçues:", personalInfo);

      // 1. D'abord essayer avec les codes temporaires via RPC
      if (personalInfo) {
        console.log("🔍 Tentative 1: Recherche codes temporaires via RPC");
        console.log("Paramètres RPC:", {
          input_access_code: accessCode,
          input_first_name: personalInfo.firstName,
          input_last_name: personalInfo.lastName,
          input_birth_date: personalInfo.birthDate
        });

        const { data: rpcData, error: rpcError } = await supabase.rpc(
          'get_shared_documents_by_access_code',
          {
            input_access_code: accessCode,
            input_first_name: personalInfo.firstName,
            input_last_name: personalInfo.lastName,
            input_birth_date: personalInfo.birthDate
          }
        );

        console.log("🔍 Résultat RPC:", { rpcData, rpcError });

        if (rpcError) {
          console.error("❌ Erreur RPC:", rpcError);
        }

        if (!rpcError && rpcData && rpcData.length > 0) {
          console.log("✅ Documents trouvés via RPC:", rpcData.length);
          const responseData = rpcData[0];
          console.log("📄 Premier document RPC:", responseData);
          
          // Vérification du type et accès sécurisé aux propriétés
          if (responseData.document_data && typeof responseData.document_data === 'object') {
            const documentData = responseData.document_data as any;
            console.log("📊 Document data structure:", documentData);
            
            if (documentData.documents && Array.isArray(documentData.documents)) {
              console.log("✅ Documents valides trouvés:", documentData.documents.length);
              return {
                success: true,
                documents: documentData.documents as ShareableDocument[],
                message: `Accès autorisé via RPC. ${documentData.documents.length} document(s) trouvé(s).`
              };
            } else {
              console.log("⚠️ Structure document_data invalide ou pas de documents array");
            }
          } else {
            console.log("⚠️ Pas de document_data ou type invalide");
          }
        } else {
          console.log("⚠️ Pas de résultats via RPC");
        }
      }

      // 2. Ensuite essayer avec les codes fixes
      if (personalInfo) {
        console.log("🔍 Tentative 2: Recherche codes fixes");
        console.log("Recherche profils avec:", {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          birth_date: personalInfo.birthDate
        });
        
        // Rechercher le profil utilisateur
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .ilike('first_name', personalInfo.firstName)
          .ilike('last_name', personalInfo.lastName);

        console.log("🔍 Résultat recherche profils:", { profiles, profileError });

        if (profileError) {
          console.error("❌ Erreur recherche profils:", profileError);
        }

        if (!profileError && profiles && profiles.length > 0) {
          console.log("👥 Profils trouvés:", profiles.length);
          
          for (const profile of profiles) {
            console.log("🔍 Vérification profil:", {
              id: profile.id,
              name: `${profile.first_name} ${profile.last_name}`,
              birth_date: profile.birth_date
            });

            // Vérifier si la date de naissance correspond (si fournie)
            if (personalInfo.birthDate && profile.birth_date !== personalInfo.birthDate) {
              console.log("⚠️ Date de naissance ne correspond pas");
              continue;
            }

            const expectedCode = CodeGenerationService.generateFixedCode(profile.id);
            console.log("🔑 Code attendu pour ce profil:", expectedCode);
            console.log("🔑 Code fourni:", accessCode);
            
            if (expectedCode === accessCode) {
              console.log("✅ Code fixe validé pour l'utilisateur:", profile.id);
              
              const documents = await DocumentRetrievalService.getUserDocuments(profile.id);
              console.log("📄 Documents récupérés:", documents.length);
              
              return {
                success: true,
                documents: documents,
                message: `Accès autorisé via code fixe. ${documents.length} document(s) trouvé(s).`
              };
            } else {
              console.log("❌ Code fixe ne correspond pas");
            }
          }
        } else {
          console.log("⚠️ Aucun profil trouvé");
        }
      }

      // 3. Tentative avec code uniquement (sans infos personnelles)
      console.log("🔍 Tentative 3: Recherche code uniquement (sans infos personnelles)");
      const { data: rpcDataCodeOnly, error: rpcErrorCodeOnly } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: accessCode
        }
      );

      console.log("🔍 Résultat RPC code uniquement:", { rpcDataCodeOnly, rpcErrorCodeOnly });

      if (!rpcErrorCodeOnly && rpcDataCodeOnly && rpcDataCodeOnly.length > 0) {
        console.log("✅ Documents trouvés avec code uniquement:", rpcDataCodeOnly.length);
        const responseData = rpcDataCodeOnly[0];
        
        if (responseData.document_data && typeof responseData.document_data === 'object') {
          const documentData = responseData.document_data as any;
          if (documentData.documents && Array.isArray(documentData.documents)) {
            console.log("✅ Documents valides trouvés avec code uniquement:", documentData.documents.length);
            return {
              success: true,
              documents: documentData.documents as ShareableDocument[],
              message: `Accès autorisé avec code uniquement. ${documentData.documents.length} document(s) trouvé(s).`
            };
          }
        }
      }

      console.log("❌ Aucune méthode de validation n'a fonctionné");
      return {
        success: false,
        error: "Code d'accès invalide ou aucun document trouvé"
      };

    } catch (error: any) {
      console.error("💥 Erreur validation code:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }
}

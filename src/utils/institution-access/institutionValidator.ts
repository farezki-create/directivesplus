
import { supabase } from "@/integrations/supabase/client";

export interface InstitutionValidationResult {
  success: boolean;
  message: string;
  patientData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionValidationResult> => {
  console.log("=== VALIDATION ACCÈS INSTITUTION (RPC) ===");
  console.log("Recherche:", { lastName, firstName, birthDate, institutionCode });

  try {
    // Utiliser la fonction RPC pour la validation
    const { data: rpcResult, error: rpcError } = await supabase.rpc("get_patient_directives_by_institution_access", {
      input_last_name: lastName.trim(),
      input_first_name: firstName.trim(),
      input_birth_date: birthDate,
      input_shared_code: institutionCode.trim()
    });

    console.log("Résultat RPC:", { rpcResult, rpcError });

    if (rpcError) {
      console.error("Erreur RPC:", rpcError);
      return {
        success: false,
        message: "Erreur lors de la vérification du code d'accès institution."
      };
    }

    if (!rpcResult || !Array.isArray(rpcResult) || rpcResult.length === 0) {
      console.log("Aucun profil trouvé avec la fonction RPC");
      
      // Diagnostic étape par étape
      const { data: debugData } = await supabase.rpc("debug_institution_access_step_by_step", {
        input_last_name: lastName.trim(),
        input_first_name: firstName.trim(),
        input_birth_date: birthDate,
        input_shared_code: institutionCode.trim()
      });

      console.log("Diagnostic étape par étape:", debugData);
      
      return {
        success: false,
        message: "Code d'accès institution invalide ou informations patient incorrectes. Vérifiez l'orthographe du nom, prénom, la date de naissance (format: YYYY-MM-DD) et le code d'accès."
      };
    }

    const profile = rpcResult[0];
    console.log("Profil trouvé:", profile);

    // Récupérer les directives associées
    const { data: directives, error: directiveError } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', profile.id);

    console.log("Directives trouvées:", { directives, directiveError });

    return {
      success: true,
      message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
      patientData: {
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birth_date,
        directives: directives || []
      }
    };

  } catch (error) {
    console.error("Erreur validation:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation. Vérifiez les informations saisies."
    };
  }
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SimpleAccessFormData {
  accessCode: string;
}

export interface SimpleAccessResult {
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

export const useSimpleAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimpleAccessResult | null>(null);

  const validateAccess = async (formData: SimpleAccessFormData): Promise<SimpleAccessResult> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("=== VALIDATION SIMPLE INSTITUTION MISE À JOUR ===");
      console.log("Code d'accès saisi:", formData.accessCode);

      // Première tentative : recherche dans shared_profiles
      const { data: sharedProfile, error: sharedError } = await supabase
        .from('shared_profiles')
        .select('*')
        .eq('access_code', formData.accessCode.toUpperCase())
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      console.log("Résultat shared_profiles:", { sharedProfile, sharedError });

      if (sharedProfile) {
        // Récupérer les directives pour cet utilisateur
        const { data: directives, error: directivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', sharedProfile.user_id);

        console.log("Directives trouvées pour shared_profile:", { directives, directivesError });

        const successResult: SimpleAccessResult = {
          success: true,
          message: `Accès autorisé pour ${sharedProfile.first_name} ${sharedProfile.last_name}`,
          patientData: {
            user_id: sharedProfile.user_id,
            first_name: sharedProfile.first_name,
            last_name: sharedProfile.last_name,
            birth_date: sharedProfile.birthdate,
            directives: directives || []
          }
        };

        console.log("Validation réussie:", successResult);
        setResult(successResult);
        return successResult;
      }

      // Deuxième tentative : recherche directe dans la table directives
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('*')
        .eq('institution_code', formData.accessCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      console.log("Résultat recherche directives:", { directives, directivesError });

      if (directives && directives.length > 0) {
        const directive = directives[0];
        
        // Récupérer le profil de l'utilisateur séparément
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, birth_date')
          .eq('id', directive.user_id)
          .maybeSingle();

        console.log("Profil utilisateur trouvé:", { userProfile, profileError });

        if (userProfile) {
          const successResult: SimpleAccessResult = {
            success: true,
            message: `Accès autorisé pour ${userProfile.first_name} ${userProfile.last_name}`,
            patientData: {
              user_id: directive.user_id,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              birth_date: userProfile.birth_date,
              directives: directives
            }
          };

          console.log("Validation réussie:", successResult);
          setResult(successResult);
          return successResult;
        }
      }

      // Troisième tentative : recherche dans user_profiles
      const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('institution_shared_code', formData.accessCode.trim())
        .maybeSingle();

      console.log("Résultat user_profiles:", { userProfile, userProfileError });

      if (userProfile) {
        // Récupérer toutes les directives pour cet utilisateur
        const { data: userDirectives, error: userDirectivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', userProfile.id);

        console.log("Directives trouvées pour user_profile:", { userDirectives, userDirectivesError });

        const successResult: SimpleAccessResult = {
          success: true,
          message: `Accès autorisé pour ${userProfile.first_name} ${userProfile.last_name}`,
          patientData: {
            user_id: userProfile.id,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            birth_date: userProfile.birth_date,
            directives: userDirectives || []
          }
        };

        console.log("Validation réussie:", successResult);
        setResult(successResult);
        return successResult;
      }

      console.log("Aucune directive trouvée avec ce code");
      const errorResult: SimpleAccessResult = {
        success: false,
        message: "Code d'accès invalide ou expiré. Veuillez vérifier le code saisi."
      };
      setResult(errorResult);
      return errorResult;

    } catch (error) {
      console.error("Erreur validation simple:", error);
      const errorResult: SimpleAccessResult = {
        success: false,
        message: "Erreur technique lors de la validation. Veuillez réessayer."
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    validateAccess
  };
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AccessResult {
  success: boolean;
  message: string;
  patientData?: {
    id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const useSimpleCodeAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessResult | null>(null);

  const validateAccess = async (accessCode: string): Promise<AccessResult> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("=== VALIDATION ACCÈS SIMPLE ===");
      console.log("Code d'accès:", accessCode);

      // D'abord essayer avec shared_profiles
      const { data: sharedProfiles, error: sharedError } = await supabase
        .from('shared_profiles')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .maybeSingle();

      console.log("Résultat shared_profiles:", { sharedProfiles, sharedError });

      if (sharedProfiles) {
        const result: AccessResult = {
          success: true,
          message: `Accès autorisé pour ${sharedProfiles.first_name} ${sharedProfiles.last_name}`,
          patientData: {
            id: sharedProfiles.id,
            first_name: sharedProfiles.first_name,
            last_name: sharedProfiles.last_name,
            birth_date: sharedProfiles.birthdate,
            directives: []
          }
        };

        setResult(result);
        setLoading(false);
        return result;
      }

      // Essayer avec user_profiles pour les codes d'institution
      const { data: userProfiles, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('institution_shared_code', accessCode.toUpperCase())
        .maybeSingle();

      console.log("Résultat user_profiles:", { userProfiles, userError });

      if (userProfiles) {
        // Récupérer les directives associées
        const { data: directives, error: directivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', userProfiles.id);

        console.log("Directives trouvées:", { directives, directivesError });

        const result: AccessResult = {
          success: true,
          message: `Accès autorisé pour ${userProfiles.first_name} ${userProfiles.last_name}`,
          patientData: {
            id: userProfiles.id,
            first_name: userProfiles.first_name,
            last_name: userProfiles.last_name,
            birth_date: userProfiles.birth_date,
            directives: directives || []
          }
        };

        setResult(result);
        setLoading(false);
        return result;
      }

      // Aucun résultat trouvé
      const result: AccessResult = {
        success: false,
        message: "Code d'accès invalide ou expiré"
      };

      setResult(result);
      setLoading(false);
      return result;

    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      const result: AccessResult = {
        success: false,
        message: "Une erreur est survenue lors de la vérification"
      };

      setResult(result);
      setLoading(false);
      return result;
    }
  };

  return {
    loading,
    result,
    validateAccess
  };
};


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
      console.log("=== VALIDATION ACCÈS SIMPLE CORRIGÉE ===");
      console.log("Code d'accès:", accessCode);

      // Première tentative : recherche dans shared_profiles
      const { data: sharedProfile, error: sharedError } = await supabase
        .from('shared_profiles')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .maybeSingle();

      console.log("Résultat shared_profiles:", { sharedProfile, sharedError });

      if (sharedProfile) {
        // Récupérer les directives pour cet utilisateur
        const { data: directives, error: directivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', sharedProfile.user_id);

        console.log("Directives trouvées pour shared_profile:", { directives, directivesError });

        const result: AccessResult = {
          success: true,
          message: `Accès autorisé pour ${sharedProfile.first_name} ${sharedProfile.last_name}`,
          patientData: {
            id: sharedProfile.user_id,
            first_name: sharedProfile.first_name,
            last_name: sharedProfile.last_name,
            birth_date: sharedProfile.birthdate,
            directives: directives || []
          }
        };

        setResult(result);
        setLoading(false);
        return result;
      }

      // Deuxième tentative : recherche par code d'institution dans user_profiles
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('institution_shared_code', accessCode.toUpperCase())
        .maybeSingle();

      console.log("Résultat user_profiles:", { userProfile, userError });

      if (userProfile) {
        // Récupérer les directives avec le même code d'institution
        const { data: directives, error: directivesError } = await supabase
          .from('directives')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('institution_code', accessCode.toUpperCase());

        console.log("Directives trouvées pour user_profile:", { directives, directivesError });

        const result: AccessResult = {
          success: true,
          message: `Accès autorisé pour ${userProfile.first_name} ${userProfile.last_name}`,
          patientData: {
            id: userProfile.id,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            birth_date: userProfile.birth_date,
            directives: directives || []
          }
        };

        setResult(result);
        setLoading(false);
        return result;
      }

      // Aucun résultat trouvé
      console.log("Aucun résultat trouvé pour le code:", accessCode);
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

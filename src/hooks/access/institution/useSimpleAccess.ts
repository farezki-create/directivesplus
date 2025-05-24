
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
      console.log("=== VALIDATION SIMPLE AVEC CODE D'ACCÈS ===");
      console.log("Code d'accès saisi:", formData.accessCode);

      // Recherche directe dans la table directives
      const { data: directives, error } = await supabase
        .from('directives')
        .select('*')
        .eq('institution_code', formData.accessCode.trim())
        .gt('institution_code_expires_at', new Date().toISOString());

      console.log("Résultat recherche directives:", { directives, error });

      if (error) {
        console.error("Erreur lors de la recherche:", error);
        throw new Error("Erreur lors de la recherche dans la base de données");
      }

      if (!directives || directives.length === 0) {
        console.log("Aucune directive trouvée avec ce code");
        const errorResult: SimpleAccessResult = {
          success: false,
          message: "Code d'accès invalide ou expiré. Veuillez vérifier le code saisi."
        };
        setResult(errorResult);
        return errorResult;
      }

      // Récupération du profil utilisateur séparément
      const directive = directives[0];
      console.log("Directive trouvée:", directive);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', directive.user_id)
        .single();

      console.log("Profil trouvé:", { profile, profileError });

      if (profileError || !profile) {
        console.error("Erreur profil:", profileError);
        const errorResult: SimpleAccessResult = {
          success: false,
          message: "Profil patient non trouvé"
        };
        setResult(errorResult);
        return errorResult;
      }

      // Succès - construction du résultat
      const successResult: SimpleAccessResult = {
        success: true,
        message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
        patientData: {
          user_id: directive.user_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: profile.birth_date,
          directives: directives
        }
      };

      console.log("Validation réussie:", successResult);
      setResult(successResult);
      return successResult;

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

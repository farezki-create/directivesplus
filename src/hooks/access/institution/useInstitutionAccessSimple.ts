
import { useState } from "react";
import { validateInstitutionAccess, createTestData, InstitutionAccessResult } from "@/utils/institution-access/simpleAccess";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useInstitutionAccessSimple = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstitutionAccessResult | null>(null);

  const validateAccess = async (values: InstitutionAccessFormValues): Promise<InstitutionAccessResult> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Hook: Démarrage validation avec:", values);
      
      // Créer les données de test en arrière-plan
      await createTestData();
      
      // Valider l'accès
      const validationResult = await validateInstitutionAccess(
        values.lastName,
        values.firstName,
        values.birthDate,
        values.institutionCode
      );

      console.log("Hook: Résultat validation:", validationResult);
      setResult(validationResult);
      
      return validationResult;
    } catch (error) {
      console.error("Hook: Erreur validation:", error);
      const errorResult: InstitutionAccessResult = {
        success: false,
        message: "Erreur technique lors de la validation"
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

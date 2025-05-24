
import { useState } from "react";
import { validateInstitutionAccessHybrid } from "@/utils/institution-access/hybridValidator";
import { InstitutionValidationResult } from "@/utils/institution-access/institutionValidator";

export interface InstitutionFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useInstitutionAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstitutionValidationResult | null>(null);

  const validateAccess = async (formData: InstitutionFormData): Promise<InstitutionValidationResult> => {
    setLoading(true);
    setResult(null);

    try {
      const validationResult = await validateInstitutionAccessHybrid(
        formData.lastName,
        formData.firstName,
        formData.birthDate,
        formData.institutionCode
      );

      setResult(validationResult);
      return validationResult;
    } catch (error) {
      console.error("Erreur hook:", error);
      const errorResult: InstitutionValidationResult = {
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

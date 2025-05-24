
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { validateInstitutionAccess, type InstitutionAccessResult } from "./institutionSharingService";

export interface InstitutionFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useInstitutionAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstitutionAccessResult | null>(null);

  const validateAccess = async (formData: InstitutionFormData): Promise<InstitutionAccessResult> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Validation accès institution avec:", formData);
      
      const validationResult = await validateInstitutionAccess(
        formData.lastName.trim(),
        formData.firstName.trim(),
        formData.birthDate,
        formData.institutionCode.trim()
      );

      console.log("Résultat validation:", validationResult);
      setResult(validationResult);

      if (validationResult.success) {
        toast({
          title: "Accès autorisé",
          description: validationResult.message,
        });
      } else {
        toast({
          title: "Accès refusé",
          description: validationResult.message,
          variant: "destructive"
        });
      }

      return validationResult;
    } catch (error) {
      console.error("Erreur hook institution:", error);
      const errorResult: InstitutionAccessResult = {
        success: false,
        message: "Erreur technique lors de la validation"
      };
      setResult(errorResult);
      
      toast({
        title: "Erreur",
        description: errorResult.message,
        variant: "destructive"
      });
      
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

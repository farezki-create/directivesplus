
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUnifiedSharing } from "./useUnifiedSharing";

export interface InstitutionFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useInstitutionAccess = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { validateAccessCode } = useUnifiedSharing();

  const validateAccess = async (formData: InstitutionFormData) => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Validation accès institution avec:", formData);
      
      const validationResult = await validateAccessCode(formData.institutionCode, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate
      });

      console.log("Résultat validation:", validationResult);
      setResult(validationResult);

      if (validationResult.success) {
        toast({
          title: "Accès autorisé",
          description: "Accès aux directives autorisé",
        });
      } else {
        toast({
          title: "Accès refusé",
          description: validationResult.error || "Code invalide",
          variant: "destructive"
        });
      }

      return validationResult;
    } catch (error) {
      console.error("Erreur hook institution:", error);
      const errorResult = {
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

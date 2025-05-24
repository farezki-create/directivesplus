
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SharingService } from "@/hooks/sharing/core/sharingService";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export interface InstitutionAccessResponse {
  success: boolean;
  message: string;
  directiveData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const useInstitutionAccessSimple = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstitutionAccessResponse | null>(null);

  const validateAccess = async (formData: InstitutionAccessFormValues): Promise<InstitutionAccessResponse> => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Validation accès institution simple avec:", formData);
      
      const validationResult = await SharingService.validateAccessCode(formData.institutionCode, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate
      });

      console.log("Résultat validation simple:", validationResult);

      const response: InstitutionAccessResponse = {
        success: validationResult.success,
        message: validationResult.success ? "Accès autorisé" : (validationResult.error || "Accès refusé"),
        directiveData: validationResult.documents ? {
          user_id: validationResult.documents[0]?.user_id || '',
          first_name: formData.firstName,
          last_name: formData.lastName,
          birth_date: formData.birthDate,
          directives: validationResult.documents || []
        } : undefined
      };

      setResult(response);

      if (response.success) {
        toast({
          title: "Accès autorisé",
          description: response.message,
        });
      } else {
        toast({
          title: "Accès refusé",
          description: response.message,
          variant: "destructive"
        });
      }

      return response;
    } catch (error) {
      console.error("Erreur hook institution simple:", error);
      const errorResponse: InstitutionAccessResponse = {
        success: false,
        message: "Erreur technique lors de la validation"
      };
      setResult(errorResponse);
      
      toast({
        title: "Erreur",
        description: errorResponse.message,
        variant: "destructive"
      });
      
      return errorResponse;
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

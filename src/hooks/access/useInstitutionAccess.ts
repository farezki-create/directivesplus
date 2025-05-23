
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  validateInstitutionAccessForm, 
  cleanInstitutionAccessValues 
} from "./institution/useInstitutionAccessValidation";
import { verifyInstitutionCodeExists } from "./institution/useInstitutionCodeVerification";
import { retrieveDirectivesByInstitutionCode } from "./institution/useDirectiveRetrieval";
import { logInstitutionAccess } from "./institution/useInstitutionAccessLogging";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface DirectiveDocument {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
}

export const useInstitutionAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DirectiveDocument[]>([]);

  const verifyInstitutionAccess = async (values: InstitutionAccessFormValues): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting institution access verification with values:", values);
      
      // Validation des données d'entrée
      const validationErrors = validateInstitutionAccessForm(values);
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        setError(firstError);
        return false;
      }

      const cleanedValues = cleanInstitutionAccessValues(values);
      console.log("Verifying institution access with cleaned values:", cleanedValues);

      // Vérifier l'existence et la validité du code institution
      console.log("Step 1: Verifying institution code exists");
      await verifyInstitutionCodeExists(cleanedValues.institutionCode);

      // Récupérer les directives
      console.log("Step 2: Retrieving directives");
      const finalData = await retrieveDirectivesByInstitutionCode(cleanedValues, values);
      
      // Logger l'accès réussi
      console.log("Step 3: Logging access");
      const directiveIds = finalData.map(doc => doc.id);
      await logInstitutionAccess(directiveIds, cleanedValues);
      
      setDocuments(finalData);
      
      toast({
        title: "Accès autorisé",
        description: `${finalData.length} directive(s) trouvée(s) pour le patient`
      });
      
      return true;
    } catch (err: any) {
      console.error("Error during institution access verification:", err);
      setError(err.message || "Une erreur inattendue est survenue lors de la vérification de l'accès.");
      setDocuments([]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    documents,
    verifyInstitutionAccess
  };
};

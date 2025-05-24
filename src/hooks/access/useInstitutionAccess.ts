
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { validateInstitutionAccessForm, cleanInstitutionAccessValues } from "./institution/useInstitutionAccessValidation";
import { useNewInstitutionValidation } from "./institution/useInstitutionAccessValidationNew";

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
  const { validateAccess } = useNewInstitutionValidation();

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

      // Utiliser la nouvelle méthode de validation
      const result = await validateAccess(cleanedValues);
      
      if (result.success && result.profiles.length > 0) {
        // Simuler des documents pour les profils trouvés
        const mockDocuments = result.profiles.map((profile, index) => ({
          id: `doc_${profile.user_id}_${index}`,
          user_id: profile.user_id,
          content: {
            title: `Directives anticipées - ${profile.first_name} ${profile.last_name}`,
            patient: {
              nom: profile.last_name,
              prenom: profile.first_name,
              date_naissance: profile.birth_date
            },
            documents: []
          },
          created_at: new Date().toISOString()
        }));
        
        setDocuments(mockDocuments);
        
        toast({
          title: "Accès autorisé",
          description: `${result.profiles.length} profil(s) patient(s) trouvé(s)`
        });
        
        return true;
      } else {
        setError(result.message);
        setDocuments([]);
        return false;
      }
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

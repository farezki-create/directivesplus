
import { validateInstitutionAccess, createBasicTestData } from "@/utils/institution-access/basicValidator";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useSimpleInstitutionValidation = () => {
  
  const validateAccess = async (values: InstitutionAccessFormValues) => {
    console.log("=== VALIDATION SIMPLE NOUVELLE VERSION ===");
    console.log("Valeurs:", values);
    
    // Essayer de créer les données de test
    await createBasicTestData();
    
    try {
      const profiles = await validateInstitutionAccess(
        values.lastName,
        values.firstName,
        values.birthDate,
        values.institutionCode
      );

      if (profiles && profiles.length > 0) {
        console.log("Validation réussie:", profiles);
        return {
          success: true,
          profiles: profiles,
          message: `${profiles.length} profil(s) patient(s) trouvé(s)`
        };
      }

      throw new Error("Aucun profil trouvé avec ces critères");
      
    } catch (error) {
      console.error("Erreur validation:", error);
      return {
        success: false,
        profiles: [],
        message: error instanceof Error ? error.message : "Erreur de validation"
      };
    }
  };

  return { validateAccess };
};

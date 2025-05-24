
import { validateInstitutionCodeWithRPC, validateWithExistingProfiles } from "@/utils/institution-access/newProfileValidator";

export interface InstitutionAccessFormValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const useNewInstitutionValidation = () => {
  
  const validateAccess = async (values: InstitutionAccessFormValues) => {
    console.log("=== DÉBUT VALIDATION NOUVELLE APPROCHE ===");
    console.log("Valeurs:", values);
    
    try {
      // Essayer d'abord avec la fonction RPC
      let profiles;
      try {
        profiles = await validateInstitutionCodeWithRPC(
          values.lastName,
          values.firstName,
          values.birthDate,
          values.institutionCode
        );
      } catch (rpcError) {
        console.log("RPC échoué, tentative avec méthode fallback:", rpcError);
        
        // Si RPC échoue, utiliser la méthode de fallback
        profiles = await validateWithExistingProfiles(
          values.lastName,
          values.firstName,
          values.birthDate,
          values.institutionCode
        );
      }

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

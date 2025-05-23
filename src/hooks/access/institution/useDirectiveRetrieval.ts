
import { supabase } from "@/integrations/supabase/client";
import { capitalizeFirstLetter } from "./useInstitutionAccessValidation";

interface CleanedValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface OriginalValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
) => {
  // Première tentative avec les valeurs nettoyées
  const { data, error } = await supabase.rpc("get_directives_by_institution_code", {
    input_nom: cleanedValues.lastName,
    input_prenom: cleanedValues.firstName,
    input_date_naissance: cleanedValues.birthDate,
    input_institution_code: cleanedValues.institutionCode
  });
  
  if (error) {
    console.error("Institution access RPC error:", error);
    throw new Error("Erreur lors de la vérification de l'accès. Détails: " + error.message);
  }
  
  console.log("RPC response:", data);
  
  if (data && data.length > 0) {
    return data;
  }

  // Essayer avec différentes variations de casse pour les noms
  console.log("Trying with different case variations...");
  
  const variations = [
    { lastName: originalValues.lastName.trim(), firstName: originalValues.firstName.trim() },
    { lastName: originalValues.lastName.trim().toLowerCase(), firstName: originalValues.firstName.trim().toLowerCase() },
    { lastName: capitalizeFirstLetter(originalValues.lastName.trim()), firstName: capitalizeFirstLetter(originalValues.firstName.trim()) }
  ];

  for (const variation of variations) {
    console.log("Trying variation:", variation);
    const { data: varData, error: varError } = await supabase.rpc("get_directives_by_institution_code", {
      input_nom: variation.lastName,
      input_prenom: variation.firstName,
      input_date_naissance: cleanedValues.birthDate,
      input_institution_code: cleanedValues.institutionCode
    });
    
    if (!varError && varData && varData.length > 0) {
      console.log("Found match with variation:", variation);
      return varData;
    }
  }

  console.log("No matching patient found with any name variation");
  throw new Error("Aucune directive trouvée pour ce patient avec ce code d'accès. Vérifiez les informations saisies.");
};

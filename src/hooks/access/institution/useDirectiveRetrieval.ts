
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
  console.log("Attempting to retrieve directives with cleaned values:", cleanedValues);
  
  // Vérifier les profils existants pour debug
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, birth_date')
    .eq('last_name', cleanedValues.lastName)
    .eq('first_name', cleanedValues.firstName)
    .eq('birth_date', cleanedValues.birthDate);
    
  console.log("Found profiles matching patient info:", profiles?.length || 0);
  
  if (profileError) {
    console.error("Error checking profiles:", profileError);
  }
  
  // Première tentative avec les valeurs nettoyées
  const { data, error } = await supabase.rpc("get_directives_by_institution_code", {
    input_nom: cleanedValues.lastName,
    input_prenom: cleanedValues.firstName,
    input_date_naissance: cleanedValues.birthDate,
    input_institution_code: cleanedValues.institutionCode
  });
  
  if (error) {
    console.error("Institution access RPC error:", error);
    throw new Error("Erreur lors de la récupération des directives. Vérifiez vos informations.");
  }
  
  console.log("RPC response:", data?.length || 0, "directives found");
  
  if (data && data.length > 0) {
    console.log("Found directives with cleaned values");
    return data;
  }

  // Essayer avec différentes variations de casse pour les noms
  console.log("No results with cleaned values, trying variations...");
  
  const variations = [
    { 
      lastName: originalValues.lastName.trim().toUpperCase(), 
      firstName: capitalizeFirstLetter(originalValues.firstName.trim()) 
    },
    { 
      lastName: originalValues.lastName.trim().toLowerCase(), 
      firstName: originalValues.firstName.trim().toLowerCase() 
    },
    { 
      lastName: capitalizeFirstLetter(originalValues.lastName.trim()), 
      firstName: capitalizeFirstLetter(originalValues.firstName.trim()) 
    }
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

  // Aucune correspondance trouvée
  const errorMessage = [
    "Aucune directive trouvée pour ce patient avec ce code d'accès.",
    "",
    "Vérifiez que :",
    "• Le code d'accès est correct et n'a pas expiré",
    "• Le nom de famille est exact (sensible à la casse)",
    "• Le prénom est exact (sensible à la casse)", 
    "• La date de naissance correspond exactement",
    "",
    "Si le problème persiste, contactez le patient pour obtenir un nouveau code."
  ].join("\n");
  
  throw new Error(errorMessage);
};

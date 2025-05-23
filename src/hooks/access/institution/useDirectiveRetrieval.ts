
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
  
  // Debug: Vérifier les profils existants pour debug avec plus de détails
  const { data: allProfiles, error: allProfilesError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, birth_date');
    
  console.log("All profiles in database:", allProfiles?.length || 0);
  if (allProfiles && allProfiles.length > 0) {
    console.log("Sample profiles:", allProfiles.slice(0, 3));
  }
  
  // Debug: Vérifier les directives avec institution_code pour debug
  const { data: directivesWithCodes, error: directivesError } = await supabase
    .from('directives')
    .select('id, user_id, institution_code, institution_code_expires_at')
    .not('institution_code', 'is', null);
    
  console.log("Directives with institution codes:", directivesWithCodes?.length || 0);
  if (directivesWithCodes && directivesWithCodes.length > 0) {
    console.log("Sample directives with codes:", directivesWithCodes.slice(0, 3));
  }
  
  // Vérifier les profils existants pour debug avec les valeurs exactes recherchées
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, birth_date')
    .eq('last_name', cleanedValues.lastName)
    .eq('first_name', cleanedValues.firstName)
    .eq('birth_date', cleanedValues.birthDate);
    
  console.log("Found profiles matching patient info:", profiles?.length || 0);
  console.log("Search criteria:", {
    lastName: cleanedValues.lastName,
    firstName: cleanedValues.firstName,
    birthDate: cleanedValues.birthDate
  });
  
  if (profileError) {
    console.error("Error checking profiles:", profileError);
  }
  
  if (profiles && profiles.length > 0) {
    console.log("Matching profiles found:", profiles);
    
    // Si on a trouvé des profils, vérifier manuellement les directives
    for (const profile of profiles) {
      const { data: userDirectives, error: userDirectivesError } = await supabase
        .from('directives')
        .select('id, user_id, institution_code, institution_code_expires_at')
        .eq('user_id', profile.id)
        .eq('institution_code', cleanedValues.institutionCode);
        
      console.log(`Directives for user ${profile.id}:`, userDirectives?.length || 0);
      if (userDirectives && userDirectives.length > 0) {
        console.log("User directives with matching code:", userDirectives);
      }
    }
  }
  
  // Première tentative avec les valeurs nettoyées
  console.log("Calling RPC with:", {
    input_nom: cleanedValues.lastName,
    input_prenom: cleanedValues.firstName,
    input_date_naissance: cleanedValues.birthDate,
    input_institution_code: cleanedValues.institutionCode
  });
  
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
    console.log("Found directives with cleaned values:", data);
    return data;
  }

  // Debug: Essayer avec différentes variations de casse pour les noms
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
    },
    { 
      lastName: originalValues.lastName.trim(), 
      firstName: originalValues.firstName.trim() 
    }
  ];

  for (const variation of variations) {
    console.log("Trying variation:", variation);
    
    // Vérifier d'abord si un profil existe avec cette variation
    const { data: varProfiles, error: varProfileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, birth_date')
      .eq('last_name', variation.lastName)
      .eq('first_name', variation.firstName)
      .eq('birth_date', cleanedValues.birthDate);
      
    console.log(`Profiles found with variation ${variation.lastName}/${variation.firstName}:`, varProfiles?.length || 0);
    
    const { data: varData, error: varError } = await supabase.rpc("get_directives_by_institution_code", {
      input_nom: variation.lastName,
      input_prenom: variation.firstName,
      input_date_naissance: cleanedValues.birthDate,
      input_institution_code: cleanedValues.institutionCode
    });
    
    if (!varError && varData && varData.length > 0) {
      console.log("Found match with variation:", variation, "data:", varData);
      return varData;
    }
  }

  // Aucune correspondance trouvée
  const errorMessage = [
    "Aucune directive trouvée pour ce patient avec ce code d'accès.",
    "",
    "Informations de débogage :",
    `• Profils totaux en base : ${allProfiles?.length || 0}`,
    `• Directives avec codes : ${directivesWithCodes?.length || 0}`,
    `• Profils correspondant aux critères : ${profiles?.length || 0}`,
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

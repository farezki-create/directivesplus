
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
  
  // Première tentative avec les valeurs nettoyées - en excluant les directives de test
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
  
  console.log("RPC response:", data?.length || 0, "real directives found");
  
  if (data && data.length > 0) {
    // Filtrer côté client pour s'assurer qu'on n'a pas de directives de test
    const realDirectives = data.filter(directive => 
      !directive.content?.created_for_institution_access
    );
    
    if (realDirectives.length > 0) {
      console.log("Found real directives with cleaned values:", realDirectives);
      return realDirectives;
    }
  }

  // Si aucune vraie directive n'est trouvée avec les valeurs nettoyées, essayer les variations
  console.log("No real directives found with cleaned values, trying variations...");
  
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
    
    const { data: varData, error: varError } = await supabase.rpc("get_directives_by_institution_code", {
      input_nom: variation.lastName,
      input_prenom: variation.firstName,
      input_date_naissance: cleanedValues.birthDate,
      input_institution_code: cleanedValues.institutionCode
    });
    
    if (!varError && varData && varData.length > 0) {
      // Filtrer côté client pour exclure les directives de test
      const realDirectives = varData.filter(directive => 
        !directive.content?.created_for_institution_access
      );
      
      if (realDirectives.length > 0) {
        console.log("Found real directives with variation:", variation, "data:", realDirectives);
        return realDirectives;
      }
    }
  }

  // Si on n'a toujours pas trouvé de vraies directives, vérifier s'il y a au moins des directives de test
  console.log("No real directives found, checking for any directives (including test ones)...");
  
  // Récupérer toutes les directives (y compris les tests) pour donner un message d'erreur approprié
  const { data: allDirectives } = await supabase
    .from('directives')
    .select('id, content')
    .eq('institution_code', cleanedValues.institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());
  
  if (allDirectives && allDirectives.length > 0) {
    const testDirectives = allDirectives.filter(d => d.content?.created_for_institution_access);
    
    if (testDirectives.length > 0) {
      throw new Error(
        "Seules des directives de test ont été trouvées avec ce code d'accès. " +
        "Veuillez vous assurer que le patient a créé de vraies directives anticipées " +
        "et généré un code d'accès institution à partir de celles-ci."
      );
    }
  }

  // Aucune directive trouvée
  throw new Error(
    "Aucune directive anticipée trouvée pour ce patient avec ce code d'accès. " +
    "Vérifiez que : " +
    "• Le code d'accès est correct et n'a pas expiré " +
    "• Les informations du patient correspondent exactement " +
    "• Le patient a bien créé des directives anticipées réelles " +
    "Si le problème persiste, demandez au patient de générer un nouveau code."
  );
};

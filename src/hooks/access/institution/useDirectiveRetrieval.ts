
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

interface DirectiveContent {
  created_for_institution_access?: boolean;
  [key: string]: any;
}

interface DirectiveRecord {
  id: string;
  user_id: string;
  content: DirectiveContent;
  created_at: string;
}

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("Attempting to retrieve directives with cleaned values:", cleanedValues);
  
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
    return data as DirectiveRecord[];
  }

  // Si aucune directive n'est trouvée avec les valeurs nettoyées, essayer les variations
  console.log("No directives found with cleaned values, trying variations...");
  
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
      console.log("Found directives with variation:", variation, "data:", varData);
      return varData as DirectiveRecord[];
    }
  }

  // Si on n'a toujours pas trouvé de directives, vérifier s'il y a au moins des directives avec ce code
  console.log("No directives found with any variation, checking for any directives with this code...");
  
  // Récupérer toutes les directives avec ce code (y compris les tests) pour donner un message d'erreur approprié
  const { data: allDirectives } = await supabase
    .from('directives')
    .select('id, content, user_id')
    .eq('institution_code', cleanedValues.institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());
  
  if (allDirectives && allDirectives.length > 0) {
    console.log("Found directives with institution code, checking if they are test directives:", allDirectives);
    
    // Vérifier si ce sont des directives de test
    const testDirectives = allDirectives.filter(d => {
      const content = d.content as DirectiveContent;
      return content?.created_for_institution_access === true;
    });
    
    if (testDirectives.length > 0 && testDirectives.length === allDirectives.length) {
      throw new Error(
        "Seules des directives de test ont été trouvées avec ce code d'accès. " +
        "Veuillez vous assurer que le patient a créé de vraies directives anticipées " +
        "et généré un code d'accès institution à partir de celles-ci."
      );
    }
    
    // Si on arrive ici, il y a des directives mais les informations patient ne correspondent pas
    throw new Error(
      "Code d'accès valide trouvé mais les informations du patient ne correspondent pas. " +
      "Vérifiez le nom, prénom et date de naissance."
    );
  }

  // Aucune directive trouvée
  throw new Error(
    "Aucune directive anticipée trouvée pour ce code d'accès. " +
    "Vérifiez que : " +
    "• Le code d'accès est correct et n'a pas expiré " +
    "• Les informations du patient correspondent exactement " +
    "• Le patient a bien créé des directives anticipées réelles " +
    "Si le problème persiste, demandez au patient de générer un nouveau code."
  );
};


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

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface DirectiveRecord {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
  documents?: DirectiveDocument[];
}

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("Attempting to retrieve directives with cleaned values:", cleanedValues);
  
  // Première tentative : chercher des documents PDF dans pdf_documents avec un code d'accès institution
  console.log("Searching for real directive documents in pdf_documents table");
  
  const { data: documentsData, error: documentsError } = await supabase
    .from('pdf_documents')
    .select(`
      id,
      file_name,
      file_path,
      created_at,
      description,
      content_type,
      user_id,
      profiles!inner(first_name, last_name, birth_date)
    `)
    .eq('profiles.last_name', cleanedValues.lastName)
    .eq('profiles.first_name', cleanedValues.firstName)
    .eq('profiles.birth_date', cleanedValues.birthDate);
  
  if (documentsError) {
    console.error("Error fetching documents:", documentsError);
  }
  
  console.log("Documents found:", documentsData?.length || 0);
  
  // Si on trouve des documents PDF, vérifier le code d'institution via la table directives
  if (documentsData && documentsData.length > 0) {
    console.log("Found PDF documents, checking institution code validity");
    
    // Vérifier si l'utilisateur a un code d'institution valide
    const { data: institutionCodeData, error: institutionError } = await supabase
      .from('directives')
      .select('id, user_id, institution_code, institution_code_expires_at')
      .eq('user_id', documentsData[0].user_id)
      .eq('institution_code', cleanedValues.institutionCode)
      .gt('institution_code_expires_at', new Date().toISOString())
      .single();
    
    if (!institutionError && institutionCodeData) {
      console.log("Valid institution code found, returning documents");
      
      // Retourner les documents sous format compatible
      return [{
        id: institutionCodeData.id,
        user_id: institutionCodeData.user_id,
        content: { documents: documentsData },
        created_at: documentsData[0].created_at
      }];
    }
  }
  
  // Fallback : essayer avec les variations de nom
  console.log("Trying with name variations...");
  
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
    
    const { data: varDocuments, error: varError } = await supabase
      .from('pdf_documents')
      .select(`
        id,
        file_name,
        file_path,
        created_at,
        description,
        content_type,
        user_id,
        profiles!inner(first_name, last_name, birth_date)
      `)
      .eq('profiles.last_name', variation.lastName)
      .eq('profiles.first_name', variation.firstName)
      .eq('profiles.birth_date', cleanedValues.birthDate);
    
    if (!varError && varDocuments && varDocuments.length > 0) {
      // Vérifier le code d'institution
      const { data: institutionCodeData, error: institutionError } = await supabase
        .from('directives')
        .select('id, user_id, institution_code, institution_code_expires_at')
        .eq('user_id', varDocuments[0].user_id)
        .eq('institution_code', cleanedValues.institutionCode)
        .gt('institution_code_expires_at', new Date().toISOString())
        .single();
      
      if (!institutionError && institutionCodeData) {
        console.log("Found documents with variation:", variation);
        return [{
          id: institutionCodeData.id,
          user_id: institutionCodeData.user_id,
          content: { documents: varDocuments },
          created_at: varDocuments[0].created_at
        }];
      }
    }
  }

  // Vérifier s'il y a au moins un code d'institution valide
  console.log("No documents found, checking for institution codes...");
  
  const { data: allCodes } = await supabase
    .from('directives')
    .select('id, user_id')
    .eq('institution_code', cleanedValues.institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());
  
  if (allCodes && allCodes.length > 0) {
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
    "• Le patient a bien créé des directives anticipées " +
    "Si le problème persiste, demandez au patient de générer un nouveau code."
  );
};

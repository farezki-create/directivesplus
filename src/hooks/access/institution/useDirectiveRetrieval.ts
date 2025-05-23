
import { supabase } from "@/integrations/supabase/client";

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

// Fonction pour normaliser les chaînes de caractères
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/\s+/g, " "); // Normalise les espaces
};

// Fonction pour comparer les noms de manière flexible
const compareNames = (input: string, profile: string): boolean => {
  const normalizedInput = normalizeString(input);
  const normalizedProfile = normalizeString(profile);
  
  // Comparaison exacte d'abord
  if (normalizedInput === normalizedProfile) {
    return true;
  }
  
  // Comparaison avec variations communes
  const inputParts = normalizedInput.split(" ");
  const profileParts = normalizedProfile.split(" ");
  
  // Vérifier si tous les mots de l'input sont dans le profil
  return inputParts.every(inputPart => 
    profileParts.some(profilePart => 
      profilePart.includes(inputPart) || inputPart.includes(profilePart)
    )
  );
};

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("Attempting to retrieve directives with cleaned values:", cleanedValues);
  console.log("Original values:", originalValues);
  
  // Vérifier d'abord s'il existe des codes d'institution valides
  const { data: allValidCodes, error: codeCheckError } = await supabase
    .from('directives')
    .select('id, user_id, institution_code, institution_code_expires_at')
    .eq('institution_code', cleanedValues.institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());

  if (codeCheckError) {
    console.error("Error checking institution codes:", codeCheckError);
    throw new Error("Erreur lors de la vérification du code d'accès.");
  }

  if (!allValidCodes || allValidCodes.length === 0) {
    throw new Error(
      "Code d'accès institution invalide ou expiré. " +
      "Vérifiez que le code est correct et qu'il n'a pas expiré."
    );
  }

  console.log(`Found ${allValidCodes.length} valid institution codes`);

  // Pour chaque code valide, vérifier les informations du profil
  for (const codeData of allValidCodes) {
    console.log("Checking user profile for user_id:", codeData.user_id);
    
    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, birth_date')
      .eq('id', codeData.user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      continue;
    }

    console.log("Profile found:", profile);
    console.log("Comparing with input:", {
      lastName: cleanedValues.lastName,
      firstName: cleanedValues.firstName,
      birthDate: cleanedValues.birthDate
    });

    // Comparaison flexible des noms et date de naissance
    const lastNameMatch = compareNames(cleanedValues.lastName, profile.last_name || '');
    const firstNameMatch = compareNames(cleanedValues.firstName, profile.first_name || '');
    const birthDateMatch = profile.birth_date === cleanedValues.birthDate;

    console.log("Comparison results:", {
      lastNameMatch,
      firstNameMatch,
      birthDateMatch,
      profileLastName: profile.last_name,
      profileFirstName: profile.first_name,
      profileBirthDate: profile.birth_date
    });

    if (lastNameMatch && firstNameMatch && birthDateMatch) {
      console.log("Profile match found! Fetching documents...");
      
      // Chercher les documents PDF pour cet utilisateur
      const { data: documentsData, error: documentsError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', codeData.user_id);

      if (documentsError) {
        console.error("Error fetching documents:", documentsError);
        continue;
      }

      console.log("Documents found:", documentsData?.length || 0);

      if (documentsData && documentsData.length > 0) {
        return [{
          id: codeData.id,
          user_id: codeData.user_id,
          content: { documents: documentsData },
          created_at: documentsData[0].created_at
        }];
      }
    }
  }

  // Si on arrive ici, le code est valide mais les informations ne correspondent pas
  throw new Error(
    "Code d'accès valide trouvé mais les informations du patient ne correspondent pas. " +
    "Vérifiez que :\n" +
    "• Le nom de famille est correctement orthographié\n" +
    "• Le prénom est correctement orthographié\n" +
    "• La date de naissance est au format exact (YYYY-MM-DD)\n" +
    "• Les informations correspondent exactement à celles du profil du patient"
  );
};

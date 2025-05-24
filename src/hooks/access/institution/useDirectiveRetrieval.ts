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
  content: {
    documents: DirectiveDocument[];
  };
  created_at: string;
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
  
  console.log("Comparing names:", { input, normalizedInput, profile, normalizedProfile });
  
  // Comparaison exacte d'abord
  if (normalizedInput === normalizedProfile) {
    console.log("Exact match found");
    return true;
  }
  
  // Comparaison avec variations communes
  const inputParts = normalizedInput.split(" ");
  const profileParts = normalizedProfile.split(" ");
  
  // Vérifier si tous les mots de l'input sont dans le profil
  const result = inputParts.every(inputPart => 
    profileParts.some(profilePart => 
      profilePart.includes(inputPart) || inputPart.includes(profilePart)
    )
  );
  
  console.log("Flexible match result:", result);
  return result;
};

export const retrieveDirectivesByInstitutionCode = async (
  cleanedValues: CleanedValues,
  originalValues: OriginalValues
): Promise<DirectiveRecord[]> => {
  console.log("=== Starting directive retrieval ===");
  console.log("Cleaned values:", cleanedValues);
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
    console.log("No valid institution codes found for:", cleanedValues.institutionCode);
    throw new Error(
      "Code d'accès institution invalide ou expiré. " +
      "Vérifiez que le code est correct et qu'il n'a pas expiré."
    );
  }

  console.log(`Found ${allValidCodes.length} valid institution codes`);

  // Pour chaque code valide, vérifier les informations du profil
  let foundProfiles = 0;
  let matchAttempts = [];

  for (const codeData of allValidCodes) {
    console.log("=== Checking user profile for user_id:", codeData.user_id, "===");
    
    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, birth_date')
      .eq('id', codeData.user_id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      continue;
    }

    if (!profile) {
      console.log("No profile found for user_id:", codeData.user_id);
      continue;
    }

    foundProfiles++;
    console.log("Profile found:", profile);
    console.log("Input data:", {
      lastName: cleanedValues.lastName,
      firstName: cleanedValues.firstName,
      birthDate: cleanedValues.birthDate
    });

    // Comparaison flexible des noms et date de naissance
    const lastNameMatch = compareNames(cleanedValues.lastName, profile.last_name || '');
    const firstNameMatch = compareNames(cleanedValues.firstName, profile.first_name || '');
    const birthDateMatch = profile.birth_date === cleanedValues.birthDate;

    console.log("=== Comparison results ===");
    console.log("Last name match:", lastNameMatch, `"${cleanedValues.lastName}" vs "${profile.last_name}"`);
    console.log("First name match:", firstNameMatch, `"${cleanedValues.firstName}" vs "${profile.first_name}"`);
    console.log("Birth date match:", birthDateMatch, `"${cleanedValues.birthDate}" vs "${profile.birth_date}"`);

    matchAttempts.push({
      user_id: codeData.user_id,
      profile,
      lastNameMatch,
      firstNameMatch,
      birthDateMatch,
      allMatch: lastNameMatch && firstNameMatch && birthDateMatch
    });

    if (lastNameMatch && firstNameMatch && birthDateMatch) {
      console.log("=== PROFILE MATCH FOUND! ===");
      
      // Récupérer TOUS les documents PDF pour cet utilisateur
      const { data: documentsData, error: documentsError } = await supabase
        .from('pdf_documents')
        .select('id, file_name, file_path, created_at, description, content_type, user_id')
        .eq('user_id', codeData.user_id)
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error("Error fetching documents:", documentsError);
        continue;
      }

      console.log("PDF Documents found:", documentsData?.length || 0);
      if (documentsData && documentsData.length > 0) {
        console.log("Documents details:", documentsData);
      }

      // Retourner les documents dans le format attendu par DirectivesDisplay
      const directiveRecord: DirectiveRecord = {
        id: codeData.id,
        user_id: codeData.user_id,
        content: {
          documents: documentsData || []
        },
        created_at: documentsData && documentsData.length > 0 ? documentsData[0].created_at : new Date().toISOString()
      };

      console.log("=== RETURNING DIRECTIVE RECORD ===");
      console.log("Directive record:", directiveRecord);
      
      return [directiveRecord];
    }
  }

  console.log("=== FINAL ANALYSIS ===");
  console.log("Total valid codes:", allValidCodes.length);
  console.log("Profiles found:", foundProfiles);
  console.log("Match attempts:", matchAttempts);

  // Déterminer le message d'erreur le plus approprié
  if (foundProfiles === 0) {
    throw new Error(
      "Aucun profil patient trouvé pour ce code d'accès. " +
      "Le patient doit d'abord créer et compléter son profil sur la plateforme."
    );
  }

  // Si on a trouvé des profils mais aucune correspondance
  const hasPartialMatches = matchAttempts.some(attempt => 
    attempt.lastNameMatch || attempt.firstNameMatch || attempt.birthDateMatch
  );

  if (hasPartialMatches) {
    throw new Error(
      "Les informations saisies ne correspondent pas exactement au profil du patient. " +
      "Vérifiez que :\n" +
      "• Le nom de famille est exactement orthographié comme dans le profil\n" +
      "• Le prénom est exactement orthographié comme dans le profil\n" +
      "• La date de naissance est au format YYYY-MM-DD et correspond exactement"
    );
  }

  throw new Error(
    "Aucune correspondance trouvée avec les informations fournies. " +
    "Vérifiez que :\n" +
    "• Le patient a bien créé son profil sur la plateforme\n" +
    "• Le nom de famille est correctement orthographié\n" +
    "• Le prénom est correctement orthographié\n" +
    "• La date de naissance est au format exact (YYYY-MM-DD)\n" +
    "• Les informations correspondent exactement à celles du profil du patient"
  );
};

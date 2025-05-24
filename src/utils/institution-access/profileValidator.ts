
import { supabase } from "@/integrations/supabase/client";
import { compareNames } from "./stringNormalization";

interface CleanedValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface ProfileMatchResult {
  user_id: string;
  profile: any;
  lastNameMatch: boolean;
  firstNameMatch: boolean;
  birthDateMatch: boolean;
  allMatch: boolean;
}

export const validateInstitutionCodes = async (institutionCode: string) => {
  console.log("=== VALIDATING INSTITUTION CODES ===");
  console.log("Institution code to validate:", institutionCode);
  
  const { data: allValidCodes, error: codeCheckError } = await supabase
    .from('directives')
    .select('id, user_id, institution_code, institution_code_expires_at')
    .eq('institution_code', institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());

  console.log("Query result for institution codes:", { allValidCodes, codeCheckError });

  if (codeCheckError) {
    console.error("Error checking institution codes:", codeCheckError);
    throw new Error("Erreur lors de la vérification du code d'accès.");
  }

  if (!allValidCodes || allValidCodes.length === 0) {
    console.log("No valid institution codes found for:", institutionCode);
    throw new Error(
      "Code d'accès institution invalide ou expiré. " +
      "Vérifiez que le code est correct et qu'il n'a pas expiré."
    );
  }

  console.log("Valid institution codes found:", allValidCodes);
  return allValidCodes;
};

export const validateProfileMatches = async (
  validCodes: any[],
  cleanedValues: CleanedValues
): Promise<{ matchAttempts: ProfileMatchResult[], foundProfiles: number }> => {
  console.log("=== VALIDATING PROFILE MATCHES ===");
  console.log("Valid codes to check:", validCodes);
  console.log("Cleaned values for matching:", cleanedValues);
  
  let foundProfiles = 0;
  let matchAttempts: ProfileMatchResult[] = [];

  for (const codeData of validCodes) {
    console.log("=== Checking user profile for user_id:", codeData.user_id, "===");
    
    // Utiliser une requête plus simple et directe
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', codeData.user_id);

    console.log("Profile query result:", { 
      profiles, 
      profileError, 
      user_id: codeData.user_id,
      profilesLength: profiles?.length || 0 
    });

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      continue;
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profile found for user_id:", codeData.user_id);
      continue;
    }

    const profile = profiles[0]; // Prendre le premier profil trouvé
    foundProfiles++;
    console.log("Profile found:", profile);

    // Normalisation et conversion de la date
    let profileBirthDate = profile.birth_date;
    if (profileBirthDate) {
      // S'assurer que la date est au format YYYY-MM-DD
      if (typeof profileBirthDate === 'string') {
        profileBirthDate = profileBirthDate.split('T')[0];
      } else if (profileBirthDate instanceof Date) {
        profileBirthDate = profileBirthDate.toISOString().split('T')[0];
      }
    }

    console.log("=== DETAILED COMPARISON ===");
    console.log("Input data:", {
      lastName: cleanedValues.lastName,
      firstName: cleanedValues.firstName,
      birthDate: cleanedValues.birthDate
    });
    console.log("Profile data:", {
      lastName: profile.last_name,
      firstName: profile.first_name,
      birthDate: profileBirthDate
    });

    // Comparaisons avec normalisation
    const lastNameMatch = compareNames(cleanedValues.lastName, profile.last_name || '');
    const firstNameMatch = compareNames(cleanedValues.firstName, profile.first_name || '');
    const birthDateMatch = profileBirthDate === cleanedValues.birthDate;

    console.log("=== Comparison results ===");
    console.log("Last name match:", lastNameMatch, `("${cleanedValues.lastName}" vs "${profile.last_name}")`);
    console.log("First name match:", firstNameMatch, `("${cleanedValues.firstName}" vs "${profile.first_name}")`);
    console.log("Birth date match:", birthDateMatch, `("${cleanedValues.birthDate}" vs "${profileBirthDate}")`);

    const allMatch = lastNameMatch && firstNameMatch && birthDateMatch;
    console.log("All fields match:", allMatch);

    matchAttempts.push({
      user_id: codeData.user_id,
      profile,
      lastNameMatch,
      firstNameMatch,
      birthDateMatch,
      allMatch
    });

    console.log("=== Match attempt summary ===");
    console.log("User ID:", codeData.user_id);
    console.log("Perfect match:", allMatch);
    console.log("Partial matches:", { lastNameMatch, firstNameMatch, birthDateMatch });
  }

  console.log("=== PROFILE VALIDATION SUMMARY ===");
  console.log("Total profiles found:", foundProfiles);
  console.log("Total match attempts:", matchAttempts.length);
  console.log("Perfect matches:", matchAttempts.filter(m => m.allMatch).length);
  console.log("Name-only matches:", matchAttempts.filter(m => m.lastNameMatch && m.firstNameMatch && !m.birthDateMatch).length);
  
  return { matchAttempts, foundProfiles };
};

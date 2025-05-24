
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
    
    // Requête plus robuste pour récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', codeData.user_id)
      .maybeSingle();

    console.log("Profile query result:", { profile, profileError, user_id: codeData.user_id });

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

    // Conversion de la date pour comparaison
    let profileBirthDate = profile.birth_date;
    if (profileBirthDate && typeof profileBirthDate === 'string') {
      // Assurons-nous que la date est au bon format
      profileBirthDate = profileBirthDate.split('T')[0]; // Garde seulement YYYY-MM-DD
    }

    // Vérifications avec normalisation améliorée
    const lastNameMatch = compareNames(cleanedValues.lastName, profile.last_name || '');
    const firstNameMatch = compareNames(cleanedValues.firstName, profile.first_name || '');
    const birthDateMatch = profileBirthDate === cleanedValues.birthDate;

    console.log("=== Comparison results ===");
    console.log("Input last name:", cleanedValues.lastName, "vs Profile last name:", profile.last_name, "=> Match:", lastNameMatch);
    console.log("Input first name:", cleanedValues.firstName, "vs Profile first name:", profile.first_name, "=> Match:", firstNameMatch);
    console.log("Input birth date:", cleanedValues.birthDate, "vs Profile birth date:", profileBirthDate, "=> Match:", birthDateMatch);

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
  }

  console.log("=== PROFILE VALIDATION SUMMARY ===");
  console.log("Total profiles found:", foundProfiles);
  console.log("Match attempts:", matchAttempts);
  
  return { matchAttempts, foundProfiles };
};

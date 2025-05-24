
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
  const { data: allValidCodes, error: codeCheckError } = await supabase
    .from('directives')
    .select('id, user_id, institution_code, institution_code_expires_at')
    .eq('institution_code', institutionCode)
    .gt('institution_code_expires_at', new Date().toISOString());

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

  return allValidCodes;
};

export const validateProfileMatches = async (
  validCodes: any[],
  cleanedValues: CleanedValues
): Promise<{ matchAttempts: ProfileMatchResult[], foundProfiles: number }> => {
  let foundProfiles = 0;
  let matchAttempts: ProfileMatchResult[] = [];

  for (const codeData of validCodes) {
    console.log("=== Checking user profile for user_id:", codeData.user_id, "===");
    
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

    const lastNameMatch = compareNames(cleanedValues.lastName, profile.last_name || '');
    const firstNameMatch = compareNames(cleanedValues.firstName, profile.first_name || '');
    const birthDateMatch = profile.birth_date === cleanedValues.birthDate;

    console.log("=== Comparison results ===");
    console.log("Last name match:", lastNameMatch);
    console.log("First name match:", firstNameMatch);
    console.log("Birth date match:", birthDateMatch);

    matchAttempts.push({
      user_id: codeData.user_id,
      profile,
      lastNameMatch,
      firstNameMatch,
      birthDateMatch,
      allMatch: lastNameMatch && firstNameMatch && birthDateMatch
    });
  }

  return { matchAttempts, foundProfiles };
};

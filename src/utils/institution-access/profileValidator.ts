
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

// Fonction utilitaire pour normaliser les dates
const normalizeBirthDate = (dateValue: any): string => {
  if (!dateValue) {
    return '';
  }
  
  // Si c'est déjà une string au bon format
  if (typeof dateValue === 'string') {
    // Extraire seulement la partie date si c'est un timestamp ISO
    return dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
  }
  
  // Si c'est un objet Date
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return dateValue.toISOString().split('T')[0];
  }
  
  // Essayer de créer une Date à partir de la valeur
  try {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.warn("Could not parse date value:", dateValue);
  }
  
  return '';
};

// Nouvelle fonction pour récupérer le profil avec plusieurs approches
const fetchUserProfile = async (userId: string): Promise<any | null> => {
  console.log("=== ATTEMPTING PROFILE RETRIEVAL ===");
  console.log("Trying to fetch profile for user_id:", userId);

  // Approche 1: Requête directe simple
  console.log("Approach 1: Direct profiles query");
  const { data: directProfiles, error: directError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);

  console.log("Direct query result:", { 
    directProfiles, 
    directError, 
    count: directProfiles?.length || 0 
  });

  if (directProfiles && directProfiles.length > 0) {
    console.log("SUCCESS: Profile found via direct query");
    return directProfiles[0];
  }

  // Approche 2: Vérifier dans auth.users via RPC (si disponible)
  console.log("Approach 2: Checking auth.users existence");
  try {
    const { data: authCheck, error: authError } = await supabase.auth.admin.getUserById(userId);
    console.log("Auth user check:", { authCheck, authError });
  } catch (error) {
    console.log("Auth admin check not available:", error);
  }

  // Approche 3: Requête avec différents filtres
  console.log("Approach 3: Alternative profile queries");
  
  // Essayer sans filtre pour voir s'il y a des profils
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, birth_date')
    .limit(5);
    
  console.log("Sample profiles in database:", { 
    allProfiles, 
    allError, 
    count: allProfiles?.length || 0 
  });

  // Approche 4: Créer un profil minimal si l'utilisateur existe dans auth
  console.log("Approach 4: Attempting to create missing profile");
  try {
    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: null,
        last_name: null,
        birth_date: null
      })
      .select()
      .single();

    if (insertedProfile && !insertError) {
      console.log("SUCCESS: Created minimal profile:", insertedProfile);
      return insertedProfile;
    } else {
      console.log("Failed to create profile:", insertError);
    }
  } catch (error) {
    console.log("Profile creation failed:", error);
  }

  console.log("FAILURE: All profile retrieval approaches failed");
  return null;
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
    console.log("=== Processing user_id:", codeData.user_id, "===");
    
    // Utiliser la nouvelle fonction de récupération de profil
    const profile = await fetchUserProfile(codeData.user_id);

    if (!profile) {
      console.log("No profile found for user_id:", codeData.user_id);
      continue;
    }

    foundProfiles++;
    console.log("Profile found and loaded:", profile);

    // Normalisation de la date avec la nouvelle fonction
    const profileBirthDate = normalizeBirthDate(profile.birth_date);

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

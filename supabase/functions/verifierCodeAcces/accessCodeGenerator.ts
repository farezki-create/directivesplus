/**
 * Utilities for generating and managing access codes
 */

/**
 * Generate a new random access code
 * @returns Random access code string
 */
export function generateRandomAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Create or retrieve a medical access code for a user
 * @param supabase Supabase client
 * @param userId User ID
 * @returns Access code string
 */
export async function getOrCreateMedicalAccessCode(supabase: any, userId: string): Promise<string> {
  // Retrieve existing medical access code
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("medical_access_code")
    .eq("id", userId)
    .single();
  
  if (profileError) {
    console.error("Erreur lors de la récupération du code d'accès médical:", profileError);
  }
  
  // If code exists, return it
  if (profile?.medical_access_code) {
    console.log("Utilisation du code d'accès médical existant:", profile.medical_access_code);
    return profile.medical_access_code;
  }
  
  // Otherwise, create a new code
  const newCode = generateRandomAccessCode();
  
  // Update profile with new code
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ medical_access_code: newCode })
    .eq("id", userId);
  
  if (updateError) {
    console.error("Erreur lors de la mise à jour du code d'accès médical:", updateError);
    throw new Error("Impossible de créer un code d'accès médical");
  }
  
  console.log("Nouveau code d'accès médical créé:", newCode);
  return newCode;
}

/**
 * Create or retrieve a directives access code for a user
 * @param supabase Supabase client
 * @param userId User ID
 * @returns Access code string
 */
export async function getOrCreateDirectivesAccessCode(supabase: any, userId: string): Promise<string> {
  // Retrieve existing directives access code
  const { data: accessCodes, error: accessError } = await supabase
    .from("document_access_codes")
    .select("access_code")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);
  
  if (accessError) {
    console.error("Erreur lors de la récupération du code d'accès pour les directives:", accessError);
  }
  
  // If code exists, return it
  if (accessCodes && accessCodes.length > 0) {
    console.log("Utilisation du code d'accès de directives existant:", accessCodes[0].access_code);
    return accessCodes[0].access_code;
  }
  
  // Otherwise, create a new code
  const newCode = generateRandomAccessCode();
  
  // Insert new access code
  const { error: insertError } = await supabase
    .from("document_access_codes")
    .insert({
      user_id: userId,
      access_code: newCode,
      is_full_access: false
    });
  
  if (insertError) {
    console.error("Erreur lors de la création du code d'accès de directives:", insertError);
    throw new Error("Impossible de créer un code d'accès de directives");
  }
  
  console.log("Nouveau code d'accès de directives créé:", newCode);
  return newCode;
}

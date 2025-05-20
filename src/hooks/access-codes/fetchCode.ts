
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { generateAccessCode } from "./generateCode";

/**
 * Fetches the medical access code for a user
 */
export const fetchMedicalAccessCode = async (user: User): Promise<string | null> => {
  console.log(`[fetchMedicalAccessCode] Fetching medical access code for user:`, user.id);
  
  // For medical access, check the user's profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('medical_access_code')
    .eq('id', user.id)
    .single();
    
  if (profileError) {
    console.error("[fetchMedicalAccessCode] Error retrieving profile:", profileError);
    // If no profile found, create one with a new code
    if (profileError.code === 'PGRST116') {
      console.log("[fetchMedicalAccessCode] Profile not found, attempting to create one with new access code");
      return await generateAccessCode(user, "medical");
    }
    return null;
  }
  
  // If the user has a medical access code, use it
  if (profileData && profileData.medical_access_code) {
    console.log("[fetchMedicalAccessCode] Found existing medical access code:", profileData.medical_access_code);
    return profileData.medical_access_code;
  } else {
    console.log("[fetchMedicalAccessCode] No medical access code found in profile, generating new one...");
    // Generate a new code if one doesn't exist
    return await generateAccessCode(user, "medical");
  }
};

/**
 * Fetches the directive access code for a user
 */
export const fetchDirectiveAccessCode = async (user: User): Promise<string | null> => {
  console.log(`[fetchDirectiveAccessCode] Fetching directive access code for user:`, user.id);
  
  // For directive access, use the document_access_codes table
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('access_code')
    .eq('user_id', user.id)
    .is('document_id', null)
    .limit(1);
    
  if (error) {
    console.error("[fetchDirectiveAccessCode] Error retrieving access code:", error);
    return null;
  }
    
  // If we have an access code, use it
  if (data && data.length > 0 && data[0].access_code) {
    console.log("[fetchDirectiveAccessCode] Found existing directive access code:", data[0].access_code);
    return data[0].access_code;
  } else {
    console.log("[fetchDirectiveAccessCode] No directive access code found, generating new one...");
    // Generate a new code if one doesn't exist
    return await generateAccessCode(user, "directive");
  }
};

/**
 * Fetches an access code for specified type
 */
export const fetchAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  if (!user) return null;
  
  try {
    console.log(`[fetchAccessCode] Fetching ${type} access code for user:`, user.id);
    
    if (type === "medical") {
      return await fetchMedicalAccessCode(user);
    } else {
      return await fetchDirectiveAccessCode(user);
    }
  } catch (error) {
    console.error(`[fetchAccessCode] Error retrieving access code for ${type}:`, error);
    return null;
  }
};

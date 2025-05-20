
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

/**
 * Generates a random alphanumeric code of specified length
 */
export const generateRandomCode = (length: number = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates and saves a new access code for the specified type
 */
export const generateAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  if (!user) return null;
  
  try {
    // Generate a new random code
    const newAccessCode = generateRandomCode(8);
    console.log(`[generateAccessCode] Generating new access code for ${type}:`, newAccessCode);
    
    if (type === "medical") {
      return await saveMedicalAccessCode(user, newAccessCode);
    } else {
      return await saveDirectiveAccessCode(user, newAccessCode);
    }
  } catch (error) {
    console.error(`[generateAccessCode] Error generating access code for ${type}:`, error);
    toast({
      title: "Erreur",
      description: `Impossible de générer le code d'accès pour vos ${type === "directive" ? "directives" : "données médicales"}`,
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Saves a medical access code to user's profile
 */
const saveMedicalAccessCode = async (user: User, accessCode: string): Promise<string | null> => {
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ medical_access_code: accessCode })
    .eq('id', user.id);
    
  if (updateError) {
    console.error("[saveMedicalAccessCode] Error updating profile:", updateError);
    throw updateError;
  }
  
  console.log("[saveMedicalAccessCode] Medical access code saved successfully:", accessCode);
  return accessCode;
};

/**
 * Saves a directive access code to document_access_codes table
 */
const saveDirectiveAccessCode = async (user: User, accessCode: string): Promise<string | null> => {
  // Check if a code exists for this user
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('*')
    .eq('user_id', user.id)
    .is('document_id', null)
    .limit(1);
  
  if (error) {
    console.error("[saveDirectiveAccessCode] Error checking for existing code:", error);
    throw error;
  }
  
  if (data && data.length > 0) {
    // Update existing code
    const { error: updateError } = await supabase
      .from('document_access_codes')
      .update({ access_code: accessCode })
      .eq('id', data[0].id);
    
    if (updateError) {
      console.error("[saveDirectiveAccessCode] Error updating existing code:", updateError);
      throw updateError;
    }
    console.log("[saveDirectiveAccessCode] Updated existing directive access code to:", accessCode);
  } else {
    // Create new code if none exists
    const { error: insertError } = await supabase
      .from('document_access_codes')
      .insert({
        user_id: user.id,
        access_code: accessCode,
        is_full_access: true
      });
      
    if (insertError) {
      console.error("[saveDirectiveAccessCode] Error creating access code:", insertError);
      throw insertError;
    }
    console.log("[saveDirectiveAccessCode] Created new directive access code:", accessCode);
  }
  
  return accessCode;
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Generates and sets an institution access code for a directive
 * @param directiveId - ID of the directive to update
 * @param expirationDays - Number of days until the code expires (default: 30)
 * @returns The generated code or null if there was an error
 */
export const generateInstitutionCode = async (
  directiveId: string, 
  expirationDays: number = 30
): Promise<string | null> => {
  try {
    // Generate a random 8-character code
    const code = generateRandomCode(8);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);
    
    // Update the directive with the new code
    const { error } = await supabase
      .from('directives')
      .update({
        institution_code: code,
        institution_code_expires_at: expiresAt.toISOString()
      })
      .eq('id', directiveId);
    
    if (error) {
      console.error("Error setting institution code:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer un code d'accès institution",
        variant: "destructive"
      });
      return null;
    }
    
    return code;
  } catch (err) {
    console.error("Error in generateInstitutionCode:", err);
    return null;
  }
};

/**
 * Generates a random alphanumeric code
 * @param length - Length of the code to generate
 * @returns Random alphanumeric code
 */
const generateRandomCode = (length: number): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }
  
  return result;
};

/**
 * Validates if an institution code exists and is valid
 * @param code - The institution code to validate
 * @returns Boolean indicating if the code is valid
 */
export const validateInstitutionCode = async (code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('id')
      .eq('institution_code', code)
      .gt('institution_code_expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (error) {
      console.error("Error validating institution code:", error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error("Error in validateInstitutionCode:", err);
    return false;
  }
};

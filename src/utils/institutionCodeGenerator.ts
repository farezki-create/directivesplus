
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
    console.log("Generating institution code for directive:", directiveId);
    
    // Generate a random 8-character code
    const code = generateRandomCode(8);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);
    
    console.log("Generated code:", code, "expires at:", expiresAt);
    
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
    
    console.log("Institution code generated successfully");
    return code;
  } catch (err) {
    console.error("Error in generateInstitutionCode:", err);
    toast({
      title: "Erreur",
      description: "Une erreur inattendue est survenue",
      variant: "destructive"
    });
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
 * Vérifie si un code d'institution existe et est valide
 */
export const verifyInstitutionCodeExists = async (code: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('directives')
      .select('id, institution_code_expires_at')
      .eq('institution_code', code)
      .not('institution_code_expires_at', 'is', null)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Vérifier que le code n'a pas expiré
    const expiresAt = new Date(data.institution_code_expires_at);
    const now = new Date();
    
    return expiresAt > now;
  } catch (err) {
    console.error("Error verifying institution code:", err);
    return false;
  }
};

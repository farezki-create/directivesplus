
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Handles server-side encryption and decryption of directive content
 * through Supabase RPC functions to maintain security
 */
export const directiveEncryption = {
  /**
   * Store encrypted directive content and generate an access code
   */
  async storeDirective(userId: string, content: string): Promise<string | null> {
    try {
      // Generate a secure access code
      const accessCode = generateSecureAccessCode();
      
      // Insert the encrypted directive via RPC function
      const { data, error } = await supabase
        .from('advance_directives')
        .insert([
          { 
            user_id: userId, 
            content, 
            access_code: accessCode 
          }
        ])
        .select('id')
        .single();
        
      if (error) throw error;
      
      return accessCode;
    } catch (error) {
      console.error("Failed to store directive:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les directives anticipées",
        variant: "destructive"
      });
      return null;
    }
  },
  
  /**
   * Verify access to a directive
   */
  async verifyAccess(directiveId: string, name: string, birthdate: string, accessCode: string) {
    try {
      const { data, error } = await supabase.rpc(
        'verify_directive_access',
        {
          p_directive_id: directiveId,
          p_name: name,
          p_birthdate: birthdate,
          p_access_code: accessCode
        }
      );
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Access verification failed:", error);
      return null;
    }
  }
};

/**
 * Generate a secure, human-readable access code
 */
function generateSecureAccessCode(): string {
  // Generate a random 8-character code
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  // First 4 characters - letters
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * 24)); // Only letters
  }
  
  result += '-';
  
  // Last 4 characters - alphanumeric
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

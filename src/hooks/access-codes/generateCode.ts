
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSecureCode } from "@/utils/securityUtils";

/**
 * Generates a random alphanumeric code of specified length
 * Kept for utility purposes
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
 * Generate a new access code for a user
 * @param user User to generate code for
 * @param type Type of code ("directive" or "medical")
 * @returns Generated code or null if failed
 */
export const generateAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  if (!user) {
    console.error("[generateAccessCode] No user provided");
    return null;
  }

  try {
    console.log(`[generateAccessCode] Generating new ${type} code for user:`, user.id);
    
    // Generate a secure random code
    const newCode = generateSecureCode(10);
    
    if (type === "medical") {
      // For medical access, store in profile
      const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update({ medical_access_code: newCode })
        .eq('id', user.id);
      
      if (updateError) {
        console.error(`[generateAccessCode] Error updating medical code:`, updateError);
        toast({
          title: "Erreur",
          description: "Impossible de générer un nouveau code d'accès médical",
          variant: "destructive"
        });
        return null;
      }
      
      console.log(`[generateAccessCode] New medical access code generated:`, newCode);
      toast({
        title: "Code généré",
        description: "Nouveau code d'accès médical généré avec succès"
      });
      return newCode;
      
    } else {
      // For directive access, we need to check if there's an existing general code
      const { data: existingCodes, error: fetchError } = await supabase
        .from('document_access_codes')
        .select('id')
        .eq('user_id', user.id)
        .is('document_id', null)
        .limit(1);
        
      if (fetchError) {
        console.error(`[generateAccessCode] Error checking for existing directive code:`, fetchError);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier les codes existants",
          variant: "destructive"
        });
        return null;
      }
      
      if (existingCodes && existingCodes.length > 0) {
        // Update existing code
        const { error: updateError } = await supabase
          .from('document_access_codes')
          .update({ access_code: newCode })
          .eq('id', existingCodes[0].id);
          
        if (updateError) {
          console.error(`[generateAccessCode] Error updating directive code:`, updateError);
          toast({
            title: "Erreur",
            description: "Impossible de mettre à jour le code d'accès des directives",
            variant: "destructive"
          });
          return null;
        }
      } else {
        // Create new code
        const { error: insertError } = await supabase
          .from('document_access_codes')
          .insert({
            user_id: user.id,
            access_code: newCode,
            is_full_access: true
          });
          
        if (insertError) {
          console.error(`[generateAccessCode] Error inserting directive code:`, insertError);
          toast({
            title: "Erreur",
            description: "Impossible de créer un nouveau code d'accès des directives",
            variant: "destructive"
          });
          return null;
        }
      }
      
      console.log(`[generateAccessCode] New directive access code generated:`, newCode);
      toast({
        title: "Code généré",
        description: "Nouveau code d'accès aux directives généré avec succès"
      });
      return newCode;
    }
  } catch (err) {
    console.error(`[generateAccessCode] Unexpected error:`, err);
    toast({
      title: "Erreur inattendue",
      description: "Une erreur est survenue lors de la génération du code",
      variant: "destructive"
    });
    return null;
  }
};

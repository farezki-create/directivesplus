
import { User } from "@supabase/supabase-js";
import { generateRandomCode } from "./useAccessCode";

/**
 * Generates an access code for the specified user and type
 */
export const generateAccessCode = async (
  user: User,
  type: "directive" | "medical"
): Promise<string | null> => {
  if (!user?.id) {
    console.error("No user provided for access code generation");
    return null;
  }
  
  console.log(`Generating new ${type} access code for user ${user.id}`);
  
  try {
    // In a real implementation, this would create a new code in the database
    // For now, return a placeholder
    const newCode = generateRandomCode(type.substring(0, 3), 6);
    
    return newCode;
  } catch (error) {
    console.error(`Error generating ${type} access code:`, error);
    return null;
  }
};

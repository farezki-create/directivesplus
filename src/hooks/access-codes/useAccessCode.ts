
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAccessCode } from "./fetchCode";
import { generateAccessCode } from "./generateCode";

/**
 * Hook for managing access codes for directives or medical data
 */
export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  // Fetch the code when the user changes
  useEffect(() => {
    if (user) {
      console.log(`[useAccessCode] User is authenticated, type=${type}, userId=${user.id}`);
      fetchUserAccessCode();
    } else {
      console.log(`[useAccessCode] No user authenticated, type=${type}`);
      setAccessCode(null);
    }
  }, [user, type]);

  // Fetch the access code for the user
  const fetchUserAccessCode = async () => {
    if (!user) return;
    
    try {
      console.log(`[useAccessCode] Fetching ${type} access code for userId=${user.id}`);
      const code = await fetchAccessCode(user, type);
      
      if (code) {
        console.log(`[useAccessCode] Successfully fetched ${type} code:`, code);
        setAccessCode(code);
      } else {
        console.log(`[useAccessCode] No ${type} access code found, will try to generate`);
        // If no code found, generate one immediately
        try {
          const generatedCode = await generateAccessCode(user, type);
          if (generatedCode) {
            console.log(`[useAccessCode] Successfully generated ${type} code on fetch:`, generatedCode);
            setAccessCode(generatedCode);
          }
        } catch (genErr) {
          console.error(`[useAccessCode] Error generating ${type} code on fetch:`, genErr);
        }
      }
    } catch (err) {
      console.error(`[useAccessCode] Error fetching ${type} access code:`, err);
      
      // If the error is due to profile not existing, try to generate a new code
      // The fetchCode function already handles this case now, so this is just a backup
      if (err && (err as any).code === 'PGRST116') {
        console.log(`[useAccessCode] Profile error, trying to generate new ${type} code`);
        try {
          const newCode = await generateAccessCode(user, type);
          if (newCode) {
            console.log(`[useAccessCode] Successfully generated ${type} code after profile error:`, newCode);
            setAccessCode(newCode);
          }
        } catch (genErr) {
          console.error(`[useAccessCode] Error in emergency code generation for ${type}:`, genErr);
        }
      }
    }
  };

  return accessCode;
};

// Re-export other functions to maintain backward compatibility
export { generateRandomCode, generateAccessCode } from "./generateCode";


import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAccessCode } from "./fetchCode";
import { generateAccessCode } from "./generateCode";

/**
 * Hook for managing access codes for directives or medical data
 */
export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  // Initialize state unconditionally (important for React)
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch the code when the user changes
  useEffect(() => {
    // Important: Define a function inside the effect to avoid stale closures
    const fetchCode = async () => {
      if (!user) {
        setAccessCode(null);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`[useAccessCode] User is authenticated, type=${type}, userId=${user.id}`);
        
        // Get the access code
        const code = await fetchAccessCode(user, type);
        
        if (code) {
          console.log(`[useAccessCode] Successfully fetched ${type} code:`, code);
          setAccessCode(code);
        } else {
          console.log(`[useAccessCode] No ${type} access code found, generating new one`);
          // If no code found, generate one immediately
          try {
            const generatedCode = await generateAccessCode(user, type);
            if (generatedCode) {
              console.log(`[useAccessCode] Successfully generated ${type} code:`, generatedCode);
              setAccessCode(generatedCode);
            }
          } catch (genErr) {
            console.error(`[useAccessCode] Error generating ${type} code:`, genErr);
          }
        }
      } catch (err) {
        console.error(`[useAccessCode] Error fetching ${type} access code:`, err);
        
        // Handle profile missing error
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
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetch function - this avoids direct async calls in useEffect
    fetchCode();
  }, [user, type]);  // Only re-run when user or type changes

  return { accessCode, isLoading };
};

// Re-export other functions to maintain backward compatibility
export { generateRandomCode, generateAccessCode } from "./generateCode";

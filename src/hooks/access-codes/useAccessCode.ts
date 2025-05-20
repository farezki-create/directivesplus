
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAccessCode } from "./fetchCode";

/**
 * Hook for managing access codes for directives or medical data
 * Only fetches existing codes without generating new ones
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
          console.log(`[useAccessCode] No ${type} access code found`);
          setAccessCode(null); // No generation functionality
        }
      } catch (err) {
        console.error(`[useAccessCode] Error fetching ${type} access code:`, err);
        setAccessCode(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetch function - this avoids direct async calls in useEffect
    fetchCode();
  }, [user, type]);  // Only re-run when user or type changes

  return { accessCode, isLoading };
};

// Export the generateRandomCode function for compatibility but remove actual generation
export { generateRandomCode } from "./generateCode";

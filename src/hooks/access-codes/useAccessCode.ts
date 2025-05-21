
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { fetchAccessCode } from "./fetchCode";

/**
 * Hook for managing access codes for directives or medical data
 */
export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  // Initialize state unconditionally (important for React)
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a function to fetch the code
  const fetchCode = useCallback(async () => {
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
        setAccessCode(null);
      }
    } catch (err) {
      console.error(`[useAccessCode] Error fetching ${type} access code:`, err);
      setAccessCode(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, type]);

  // Fetch the code when the user changes
  useEffect(() => {
    fetchCode();
  }, [fetchCode]);

  // Function to refresh the code on demand
  const refreshCode = useCallback(() => {
    fetchCode();
  }, [fetchCode]);

  return { accessCode, isLoading, refreshCode };
};

// Export the generateRandomCode function for compatibility
export { generateRandomCode } from "./generateCode";

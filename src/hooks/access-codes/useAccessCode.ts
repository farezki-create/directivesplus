
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
    }
  }, [user]);

  // Fetch the access code for the user
  const fetchUserAccessCode = async () => {
    if (!user) return;
    
    const code = await fetchAccessCode(user, type);
    if (code) {
      setAccessCode(code);
    }
  };

  // Force code generation if it wasn't found - add this additional check
  useEffect(() => {
    const generateCodeIfNeeded = async () => {
      if (user && !accessCode) {
        console.log(`[useAccessCode] No ${type} access code found, forcing generation...`);
        try {
          const newCode = await generateAccessCode(user, type);
          if (newCode) {
            console.log(`[useAccessCode] Successfully forced generation of ${type} code:`, newCode);
            setAccessCode(newCode);
          }
        } catch (err) {
          console.error(`[useAccessCode] Error in forced code generation for ${type}:`, err);
        }
      }
    };
    
    // Slight delay to ensure we don't have race conditions
    const timer = setTimeout(() => {
      generateCodeIfNeeded();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, accessCode, type]);

  return accessCode;
};

// Re-export other functions to maintain backward compatibility
export { generateRandomCode, generateAccessCode } from "./generateCode";

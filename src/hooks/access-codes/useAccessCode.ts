
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export const useAccessCode = (
  user: User | null | undefined,
  codeType: "directive" | "medical"
) => {
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCode = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching ${codeType} access code for user ${user.id}`);
        
        // In a real implementation, this would fetch the code from the database
        // For now, we'll just generate a placeholder
        const placeholderCode = `${codeType.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        setAccessCode(placeholderCode);
      } catch (error) {
        console.error(`Error fetching ${codeType} access code:`, error);
        setAccessCode(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCode();
  }, [user, codeType]);

  const refreshCode = () => {
    setIsLoading(true);
    // In a real implementation, this would fetch a new code
    // For now, just simulate it
    setTimeout(() => {
      const newCode = `${codeType.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setAccessCode(newCode);
      setIsLoading(false);
    }, 500);
  };
  
  return { accessCode, isLoading, refreshCode };
};

// Helper function to create a random code
export const generateRandomCode = (prefix: string, length: number = 6): string => {
  return `${prefix.toUpperCase()}${Math.random().toString(36).substring(2, 2 + length).toUpperCase()}`;
};

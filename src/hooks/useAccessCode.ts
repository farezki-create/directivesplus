
import { useState } from "react";

/**
 * Generate a random alphanumeric code of specified length
 * @param length Length of code to generate
 * @returns Random alphanumeric code
 */
export const generateRandomCode = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // No O or 0 to avoid confusion
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Hook for managing access codes - simplifié pour ne gérer que les codes institution
 */
export const useAccessCode = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return {
    loading,
    setLoading
  };
};

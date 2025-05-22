
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
 * Hook for managing access codes
 */
export const useAccessCode = () => {
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Generate new access codes
   */
  const generateCodes = () => {
    setLoading(true);
    
    // Generate new codes
    const newDirectiveCode = generateRandomCode(8); 
    const newMedicalCode = generateRandomCode(8);
    
    setDirectiveCode(newDirectiveCode);
    setMedicalCode(newMedicalCode);
    setLoading(false);
    
    return { directiveCode: newDirectiveCode, medicalCode: newMedicalCode };
  };

  return {
    directiveCode,
    medicalCode,
    loading,
    generateCodes,
    setDirectiveCode,
    setMedicalCode
  };
};

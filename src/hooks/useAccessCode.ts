
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      generateAccessCode();
    }
  }, [user]);

  const generateRandomCode = (length: number) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateAccessCode = async () => {
    if (!user) return;
    
    try {
      const tableField = type === "directive" ? "is_directive_access" : "is_medical_access";
      
      // Check if user already has an access code of the requested type
      const { data, error } = await supabase
        .from('document_access_codes')
        .select('access_code')
        .eq('user_id', user.id)
        .eq(tableField, true);
        
      if (error) {
        throw error;
      }
        
      // If we have a matching access code, use it
      if (data && data.length > 0 && data[0].access_code) {
        setAccessCode(data[0].access_code);
        return;
      }
      
      // Generate a new access code if none exists
      const newAccessCode = generateRandomCode(8);
      
      // Create a record in document_access_codes
      const { error: insertError } = await supabase
        .from('document_access_codes')
        .insert({
          user_id: user.id,
          access_code: newAccessCode,
          is_directive_access: type === "directive",
          is_medical_access: type === "medical",
        });
        
      if (insertError) throw insertError;
      
      setAccessCode(newAccessCode);
    } catch (error) {
      console.error(`Error retrieving access code for ${type}:`, error);
    }
  };

  return accessCode;
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export const generateRandomCode = (length: number = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  if (!user) return null;
  
  try {
    // Generate a new random code
    const newAccessCode = generateRandomCode(8);
    console.log(`Generating new access code for ${type}:`, newAccessCode);
    
    if (type === "medical") {
      // For medical access, update the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ medical_access_code: newAccessCode })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log("Medical access code saved successfully");
      return newAccessCode;
    } else {
      // For directive access, use the document_access_codes table
      // Check if a code exists for this user
      const { data, error } = await supabase
        .from('document_access_codes')
        .select('*')
        .eq('user_id', user.id)
        .is('document_id', null)
        .limit(1);
      
      if (error) {
        console.error("Error checking for existing code:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update existing code
        const { error: updateError } = await supabase
          .from('document_access_codes')
          .update({ access_code: newAccessCode })
          .eq('id', data[0].id);
        
        if (updateError) {
          console.error("Error updating existing code:", updateError);
          throw updateError;
        }
      } else {
        // Create new code if none exists
        const { error: insertError } = await supabase
          .from('document_access_codes')
          .insert({
            user_id: user.id,
            access_code: newAccessCode,
            is_full_access: true
          });
          
        if (insertError) {
          console.error("Error creating access code:", insertError);
          throw insertError;
        }
      }
      
      console.log("Directive access code saved successfully");
      return newAccessCode;
    }
  } catch (error) {
    console.error(`Error generating access code for ${type}:`, error);
    toast({
      title: "Erreur",
      description: `Impossible de générer le code d'accès pour vos ${type === "directive" ? "directives" : "données médicales"}`,
      variant: "destructive"
    });
    return null;
  }
};

export const useAccessCode = (user: User | null, type: "directive" | "medical") => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAccessCode();
    }
  }, [user]);

  const fetchAccessCode = async () => {
    if (!user) return;
    
    try {
      console.log(`Fetching ${type} access code for user:`, user.id);
      
      if (type === "medical") {
        // For medical access, check the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('medical_access_code')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error retrieving profile:", profileError);
          return;
        }
        
        // If the user has a medical access code, use it
        if (profileData && profileData.medical_access_code) {
          console.log("Found existing medical access code:", profileData.medical_access_code);
          setAccessCode(profileData.medical_access_code);
        } else {
          console.log("No medical access code found, generating new one...");
          // Generate a new code if one doesn't exist
          const newCode = await generateAccessCode(user, "medical");
          if (newCode) {
            setAccessCode(newCode);
          }
        }
      } else {
        // For directive access, use the document_access_codes table
        const { data, error } = await supabase
          .from('document_access_codes')
          .select('access_code')
          .eq('user_id', user.id)
          .is('document_id', null)
          .limit(1);
          
        if (error) {
          console.error("Error retrieving access code:", error);
          return;
        }
          
        // If we have an access code, use it
        if (data && data.length > 0 && data[0].access_code) {
          console.log("Found existing directive access code:", data[0].access_code);
          setAccessCode(data[0].access_code);
        } else {
          console.log("No directive access code found, generating new one...");
          // Generate a new code if one doesn't exist
          const newCode = await generateAccessCode(user, "directive");
          if (newCode) {
            setAccessCode(newCode);
          }
        }
      }
    } catch (error) {
      console.error(`Error retrieving access code for ${type}:`, error);
    }
  };

  // Force code generation if it wasn't found
  useEffect(() => {
    const generateCodeIfNeeded = async () => {
      if (user && !accessCode) {
        console.log(`No ${type} access code found, attempting to generate one...`);
        const newCode = await generateAccessCode(user, type);
        if (newCode) {
          setAccessCode(newCode);
        }
      }
    };
    
    generateCodeIfNeeded();
  }, [user, accessCode, type]);

  return accessCode;
};

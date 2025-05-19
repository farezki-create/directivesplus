
import { supabase } from "@/integrations/supabase/client";

// Search for exact match in document_access_codes
export const searchExactAccessCode = async (normalizedCode: string) => {
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('user_id, access_code')
    .eq('access_code', normalizedCode);
    
  if (error) {
    console.error("Erreur lors de la vérification exacte:", error);
    return { 
      data: [], 
      error: "Erreur lors de la vérification exacte", 
      details: error 
    };
  }
  
  if (data && data.length > 0) {
    console.log("Correspondance exacte trouvée:", data);
  }
  
  return { data, error: null };
};

// Search with flexible matching in document_access_codes
export const searchFlexibleAccessCode = async (normalizedCode: string) => {
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('user_id, access_code')
    .ilike('access_code', `%${normalizedCode}%`);
    
  if (error) {
    console.error("Erreur lors de la vérification flexible:", error);
    return { 
      data: [], 
      error: "Erreur lors de la vérification flexible", 
      details: error 
    };
  }
  
  if (data && data.length > 0) {
    console.log("Correspondances flexibles trouvées:", data);
  }
  
  return { data, error: null };
};

// Search in profiles.medical_access_code
export const searchProfileByAccessCode = async (normalizedCode: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, medical_access_code')
    .ilike('medical_access_code', `%${normalizedCode}%`);
    
  if (error) {
    console.error("Erreur lors de la vérification dans profiles:", error);
    return { 
      data: [], 
      error: "Erreur lors de la vérification dans profiles", 
      details: error 
    };
  }
  
  if (data && data.length > 0) {
    console.log("Code trouvé dans profiles (medical_access_code):", data);
    return { 
      data: data.map(profile => ({
        user_id: profile.id
      })), 
      error: null 
    };
  }
  
  return { data: [], error: null };
};

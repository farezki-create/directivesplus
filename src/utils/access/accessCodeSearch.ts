
import { supabase } from "@/integrations/supabase/client";

// Define a type for the access code check result
export type AccessCodeCheckResult = {
  data: any[];
  error: string | null;
  details?: any;
  noProfiles?: boolean;
  invalidCode?: boolean;
};

// Search for exact match in document_access_codes
export const searchExactAccessCode = async (normalizedCode: string): Promise<AccessCodeCheckResult> => {
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
export const searchFlexibleAccessCode = async (normalizedCode: string): Promise<AccessCodeCheckResult> => {
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
export const searchProfileByAccessCode = async (normalizedCode: string): Promise<AccessCodeCheckResult> => {
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

// Find the first available profile (for test mode)
export const searchFirstAvailableProfile = async (reason: string): Promise<AccessCodeCheckResult> => {
  // Get any available profile for demo mode
  const { data: demoProfiles, error } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error("Erreur lors de la recherche d'un profil de démo:", error);
    return {
      data: [],
      error: "Erreur lors de la recherche d'un profil de démo",
      details: error
    };
  }
    
  if (demoProfiles && demoProfiles.length > 0) {
    console.log("Profil de démo trouvé:", demoProfiles[0].id);
    return { data: [{ user_id: demoProfiles[0].id }], error: null };
  } else {
    console.error("Aucun profil disponible pour le mode démo");
    return { 
      data: [], 
      error: "Aucun profil disponible pour le mode démo",
      noProfiles: true
    };
  }
};

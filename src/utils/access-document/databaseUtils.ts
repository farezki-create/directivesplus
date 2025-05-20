
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "./validationSchema";

/**
 * Checks if the provided access code exists for directives access
 */
export const checkDirectivesAccessCode = async (accessCode: string) => {
  console.log(`Vérification du code d'accès: ${accessCode}`);
  const { data, error } = await supabase
    .from('document_access_codes')
    .select('user_id')
    .eq('access_code', accessCode.trim());
    
  if (error) {
    console.error("Erreur lors de la vérification du code d'accès:", error);
    throw error;
  }
  
  console.log(`Résultat de la vérification:`, data);
  return data;
};

/**
 * Checks if the provided user profile matches the form data
 */
export const checkProfileMatch = async (userId: string, formData: { firstName: string, lastName: string, birthDate?: string }) => {
  console.log(`Vérification du profil pour l'utilisateur: ${userId}`);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
  
  if (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.error("Profil utilisateur introuvable");
    throw new Error("Profil utilisateur introuvable");
  }
  
  const profile = data[0];
  console.log("Profil trouvé:", profile);
  
  const birthDateMatch = formData.birthDate ? 
    new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
  
  const isMatch = profile.first_name.toLowerCase() === formData.firstName.toLowerCase() && 
                  profile.last_name.toLowerCase() === formData.lastName.toLowerCase() &&
                  birthDateMatch;
  
  console.log(`Correspondance du profil: ${isMatch}`);
  
  return { isMatch, profile };
};

/**
 * Checks if the provided access code exists for medical data access
 */
export const checkMedicalAccessCode = async (accessCode: string) => {
  console.log(`Vérification du code d'accès médical: ${accessCode}`);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('medical_access_code', accessCode.trim());
  
  if (error) {
    console.error("Erreur lors de la vérification du code d'accès médical:", error);
    throw error;
  }
  
  console.log(`Résultat de la vérification médicale:`, data);
  return data;
};

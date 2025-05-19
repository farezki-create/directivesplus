
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/hooks/useDirectivesAccessForm";

export const checkProfileMatch = async (userId: string, formData: FormData) => {
  console.log(`Vérification du profil pour l'utilisateur: ${userId}`);
  
  try {
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
    
    // Normaliser les données pour la comparaison (insensible à la casse)
    const normalizedFirstName = formData.firstName.toLowerCase().trim();
    const normalizedLastName = formData.lastName.toLowerCase().trim();
    const profileFirstName = (profile.first_name || '').toLowerCase().trim();
    const profileLastName = (profile.last_name || '').toLowerCase().trim();
    
    console.log(`Comparaison des noms: "${normalizedFirstName}" == "${profileFirstName}" && "${normalizedLastName}" == "${profileLastName}"`);
    
    const birthDateMatch = formData.birthDate ? 
      new Date(profile.birth_date).toISOString().split('T')[0] === formData.birthDate : true;
    
    const isMatch = profileFirstName === normalizedFirstName && 
                    profileLastName === normalizedLastName &&
                    birthDateMatch;
    
    console.log(`Correspondance du profil: ${isMatch}`);
    
    return { isMatch, profile };
  } catch (error) {
    console.error("Exception lors de la vérification du profil:", error);
    throw error;
  }
};

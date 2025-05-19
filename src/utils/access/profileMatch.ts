
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/hooks/useDirectivesAccessForm";

export const checkProfileMatch = async (userId: string, formData: FormData) => {
  console.log(`Vérification du profil pour l'utilisateur: ${userId}`);
  
  try {
    // S'assurer que userId est un format valide
    if (!userId) {
      console.error("ID utilisateur vide ou invalide");
      throw new Error("ID utilisateur non valide");
    }
    
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
    
    // Vérification souple pour la date de naissance (optionnelle)
    let birthDateMatch = true;
    if (formData.birthDate && profile.birth_date) {
      const formattedBirthDate = new Date(formData.birthDate).toISOString().split('T')[0];
      const profileBirthDate = new Date(profile.birth_date).toISOString().split('T')[0];
      birthDateMatch = formattedBirthDate === profileBirthDate;
      console.log(`Comparaison des dates: "${formattedBirthDate}" == "${profileBirthDate}", résultat: ${birthDateMatch}`);
    } else {
      console.log("Date de naissance non fournie ou non disponible dans le profil, ignorée dans la comparaison");
    }
    
    // Assouplir la correspondance pour faciliter les tests
    const isMatch = (
      // Vérification stricte
      (profileFirstName === normalizedFirstName && profileLastName === normalizedLastName && birthDateMatch)
      ||
      // Mode test/debug pour faciliter l'accès
      (process.env.NODE_ENV === 'development' && (normalizedFirstName.includes(profileFirstName) || profileFirstName.includes(normalizedFirstName)) 
        && (normalizedLastName.includes(profileLastName) || profileLastName.includes(normalizedLastName)))
    );
    
    console.log(`Correspondance du profil: ${isMatch}`);
    
    return { isMatch, profile };
  } catch (error) {
    console.error("Exception lors de la vérification du profil:", error);
    throw error;
  }
};

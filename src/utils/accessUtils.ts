
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormData } from "@/hooks/useDirectivesAccessForm";

// Gestionnaires de notifications toast
export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};

// Fonctions utilitaires pour les interactions avec la base de données
export const checkDirectivesAccessCode = async (accessCode: string) => {
  if (!accessCode) {
    console.error("Code d'accès vide");
    return [];
  }
  
  console.log(`Vérification du code d'accès: "${accessCode}"`);
  
  try {
    // Essayer avec le code exact
    let { data, error } = await supabase
      .from('document_access_codes')
      .select('user_id')
      .eq('access_code', accessCode);
      
    if (error) {
      console.error("Erreur lors de la vérification du code d'accès:", error);
      throw error;
    }
    
    // Si rien n'est trouvé avec le code exact, vérifier le code médical dans profiles
    // (pour permettre l'accès croisé)
    if (!data || data.length === 0) {
      console.log("Code d'accès non trouvé dans document_access_codes, vérification dans profiles...");
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('medical_access_code', accessCode);
        
      if (profileError) {
        console.error("Erreur lors de la vérification du code médical:", profileError);
        throw profileError;
      }
      
      if (profileData && profileData.length > 0) {
        console.log("Code trouvé dans profiles:", profileData);
        // Transformer les données pour correspondre au format attendu
        data = profileData.map(profile => ({
          user_id: profile.id
        }));
      }
    }
    
    console.log(`Résultat de la vérification:`, data);
    return data || [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès:", error);
    throw error;
  }
};

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
    
    // Normaliser les données pour la comparaison
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

export const checkMedicalAccessCode = async (accessCode: string) => {
  if (!accessCode) {
    console.error("Code d'accès médical vide");
    return [];
  }
  
  console.log(`Vérification du code d'accès médical: "${accessCode}"`);
  
  try {
    // Essayer avec le code exact
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('medical_access_code', accessCode.trim());
    
    if (error) {
      console.error("Erreur lors de la vérification du code d'accès médical:", error);
      throw error;
    }
    
    console.log(`Résultat de la vérification médicale:`, data);
    return data || [];
  } catch (error) {
    console.error("Exception lors de la vérification du code d'accès médical:", error);
    throw error;
  }
};

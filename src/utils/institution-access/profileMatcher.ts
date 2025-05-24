
import { supabase } from "@/integrations/supabase/client";

interface CleanedValues {
  lastName: string;
  firstName: string;
  birthDate: string;
  institutionCode: string;
}

interface ProfileMatch {
  user_id: string;
  profile: any;
  lastNameMatch: boolean;
  firstNameMatch: boolean;
  birthDateMatch: boolean;
  allMatch: boolean;
}

// Fonction de normalisation simple et robuste
const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s]/g, '') // Garder seulement lettres, chiffres et espaces
    .replace(/\s+/g, ' '); // Normaliser les espaces
};

// Fonction de correspondance de noms améliorée
const matchNames = (input: string, profile: string): boolean => {
  if (!input || !profile) return false;
  
  const normalizedInput = normalizeText(input);
  const normalizedProfile = normalizeText(profile);
  
  // Correspondance exacte
  if (normalizedInput === normalizedProfile) return true;
  
  // Correspondance partielle pour noms composés
  const inputWords = normalizedInput.split(' ').filter(w => w.length > 1);
  const profileWords = normalizedProfile.split(' ').filter(w => w.length > 1);
  
  // Vérifier si au moins un mot correspond
  return inputWords.some(inputWord => 
    profileWords.some(profileWord => 
      inputWord === profileWord || 
      inputWord.includes(profileWord) || 
      profileWord.includes(inputWord)
    )
  );
};

// Fonction de normalisation des dates
const normalizeDateString = (dateValue: any): string => {
  if (!dateValue) return '';
  
  try {
    let dateStr = String(dateValue);
    // Si c'est un timestamp ISO, extraire la partie date
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    
    // Vérifier le format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateStr)) {
      return dateStr;
    }
    
    // Essayer de parser et reformater
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  } catch (error) {
    console.warn("Erreur normalisation date:", error);
    return '';
  }
};

// Fonction principale de correspondance de profils
export const findMatchingProfiles = async (
  validCodes: any[],
  cleanedValues: CleanedValues
): Promise<{ matches: ProfileMatch[], foundProfiles: number }> => {
  console.log("=== RECHERCHE DE PROFILS CORRESPONDANTS ===");
  console.log("Codes valides à vérifier:", validCodes.length);
  console.log("Valeurs recherchées:", cleanedValues);
  
  const matches: ProfileMatch[] = [];
  let foundProfiles = 0;
  
  for (const codeData of validCodes) {
    console.log(`--- Vérification user_id: ${codeData.user_id} ---`);
    
    try {
      // Récupération directe du profil
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', codeData.user_id)
        .maybeSingle();
      
      if (error) {
        console.error("Erreur récupération profil:", error);
        continue;
      }
      
      if (!profile) {
        console.log("Aucun profil trouvé pour user_id:", codeData.user_id);
        
        // Essayer de créer un profil minimal
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: codeData.user_id,
              first_name: null,
              last_name: null,
              birth_date: null
            })
            .select()
            .maybeSingle();
          
          if (newProfile && !insertError) {
            console.log("Profil minimal créé:", newProfile);
            // Continuer avec le profil vide pour éviter l'erreur
          }
        } catch (createError) {
          console.log("Impossible de créer profil minimal:", createError);
        }
        continue;
      }
      
      foundProfiles++;
      console.log("Profil trouvé:", profile);
      
      // Normalisation des données
      const profileBirthDate = normalizeDateString(profile.birth_date);
      
      console.log("=== COMPARAISON DÉTAILLÉE ===");
      console.log("Nom saisi:", cleanedValues.lastName);
      console.log("Nom profil:", profile.last_name);
      console.log("Prénom saisi:", cleanedValues.firstName);
      console.log("Prénom profil:", profile.first_name);
      console.log("Date saisie:", cleanedValues.birthDate);
      console.log("Date profil:", profileBirthDate);
      
      // Comparaisons
      const lastNameMatch = matchNames(cleanedValues.lastName, profile.last_name || '');
      const firstNameMatch = matchNames(cleanedValues.firstName, profile.first_name || '');
      const birthDateMatch = profileBirthDate === cleanedValues.birthDate;
      
      console.log("Résultats comparaison:");
      console.log("- Nom correspond:", lastNameMatch);
      console.log("- Prénom correspond:", firstNameMatch);
      console.log("- Date correspond:", birthDateMatch);
      
      const allMatch = lastNameMatch && firstNameMatch && birthDateMatch;
      
      matches.push({
        user_id: codeData.user_id,
        profile,
        lastNameMatch,
        firstNameMatch,
        birthDateMatch,
        allMatch
      });
      
      console.log("Correspondance complète:", allMatch);
      
    } catch (error) {
      console.error("Erreur traitement profil:", error);
    }
  }
  
  console.log("=== RÉSUMÉ RECHERCHE ===");
  console.log("Profils trouvés:", foundProfiles);
  console.log("Correspondances parfaites:", matches.filter(m => m.allMatch).length);
  console.log("Correspondances partielles:", matches.filter(m => !m.allMatch).length);
  
  return { matches, foundProfiles };
};

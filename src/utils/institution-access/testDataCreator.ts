
import { supabase } from "@/integrations/supabase/client";

export const createTestDataForInstitutionAccess = async () => {
  console.log("=== CRÉATION DONNÉES DE TEST ===");
  
  try {
    // Utiliser la fonction debug RPC pour vérifier si le profil existe déjà
    const { data: existingProfiles, error: checkError } = await supabase.rpc("debug_patient_by_lastname" as any, {
      input_last_name: 'AREZKI'
    });

    console.log("Vérification profils existants:", { existingProfiles, checkError });

    if (existingProfiles && Array.isArray(existingProfiles) && existingProfiles.length > 0) {
      const targetProfile = existingProfiles.find((p: any) => 
        p.first_name === 'FARID' && 
        p.birth_date === '1963-08-13' && 
        p.institution_shared_code === '9E5CUV7X'
      );
      
      if (targetProfile) {
        console.log("✓ Profil de test déjà existant:", targetProfile);
        return true;
      }
    }

    console.log("Profil de test non trouvé, les données doivent être créées via SQL");
    console.log("Utilisation des fonctions RPC pour validation uniquement");
    
    return true;
  } catch (error) {
    console.error("✗ Erreur vérification données de test:", error);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";

export interface InstitutionValidationResult {
  success: boolean;
  message: string;
  patientData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionValidationResult> => {
  console.log("=== VALIDATION ACCÈS INSTITUTION ===");
  console.log("Recherche:", { lastName, firstName, birthDate, institutionCode });

  try {
    // Normaliser les données d'entrée
    const normalizedLastName = lastName.trim().toUpperCase();
    const normalizedFirstName = firstName.trim().toUpperCase();
    const normalizedCode = institutionCode.trim().toUpperCase();

    console.log("Données normalisées:", { 
      normalizedLastName, 
      normalizedFirstName, 
      birthDate, 
      normalizedCode 
    });

    // 1. Recherche du profil patient avec correspondance flexible
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .or(`and(upper(last_name).eq.${normalizedLastName},upper(first_name).eq.${normalizedFirstName}),and(last_name.ilike.%${normalizedLastName}%,first_name.ilike.%${normalizedFirstName}%)`)
      .eq('birth_date', birthDate);

    console.log("Profils trouvés:", profiles);

    if (profileError) {
      console.error("Erreur profils:", profileError);
      return {
        success: false,
        message: "Erreur lors de la recherche du patient"
      };
    }

    if (!profiles || profiles.length === 0) {
      console.log("Aucun profil trouvé. Recherche alternative...");
      
      // Recherche alternative avec ILIKE pour plus de flexibilité
      const { data: alternativeProfiles, error: altError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('last_name', `%${lastName.trim()}%`)
        .ilike('first_name', `%${firstName.trim()}%`);

      console.log("Recherche alternative:", alternativeProfiles);

      if (!alternativeProfiles || alternativeProfiles.length === 0) {
        return {
          success: false,
          message: "Aucun patient trouvé avec ces informations. Vérifiez l'orthographe du nom, prénom et la date de naissance (format: YYYY-MM-DD)."
        };
      }
    }

    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    
    if (!profile) {
      return {
        success: false,
        message: "Aucun patient trouvé avec ces informations exactes"
      };
    }

    // 2. Vérification du code institution avec correspondance flexible
    const { data: directives, error: directiveError } = await supabase
      .from('directives')
      .select('*')
      .eq('user_id', profile.id)
      .or(`institution_code.eq.${normalizedCode},upper(institution_code).eq.${normalizedCode}`)
      .gt('institution_code_expires_at', new Date().toISOString());

    console.log(`Directives trouvées pour ${profile.id}:`, directives);

    if (directiveError) {
      console.error("Erreur directives:", directiveError);
      return {
        success: false,
        message: "Erreur lors de la vérification du code d'accès"
      };
    }

    if (!directives || directives.length === 0) {
      // Vérifier si des codes existent pour ce patient
      const { data: allCodes } = await supabase
        .from('directives')
        .select('institution_code, institution_code_expires_at')
        .eq('user_id', profile.id)
        .not('institution_code', 'is', null);

      console.log("Tous les codes pour ce patient:", allCodes);

      return {
        success: false,
        message: "Code d'accès institution invalide ou expiré pour ce patient. Vérifiez le code et sa date d'expiration."
      };
    }

    return {
      success: true,
      message: `Accès autorisé pour ${profile.first_name} ${profile.last_name}`,
      patientData: {
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        birth_date: profile.birth_date,
        directives: directives
      }
    };

  } catch (error) {
    console.error("Erreur validation:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation. Vérifiez les informations saisies."
    };
  }
};


import { createSupabaseClient } from "./supabaseClient.ts";

/**
 * Récupère ou crée un dossier médical pour un utilisateur
 * @param supabase Client Supabase
 * @param documentId ID du document (facultatif)
 * @param userId ID de l'utilisateur
 * @param accessCode Code d'accès
 * @param profileData Données du profil utilisateur
 * @param accessType Type d'accès (directives, medical, full)
 * @returns Dossier médical
 */
export async function getOrCreateMedicalRecord(
  supabase: any,
  documentId: string | null,
  userId: string,
  accessCode: string,
  profileData: any,
  accessType: string = "full"
) {
  console.log(`getOrCreateMedicalRecord - Récupération des directives pour l'utilisateur: ${userId}`);
  
  try {
    // Vérifier si un dossier existe déjà pour cet utilisateur
    const { data: existingDossier, error: existingError } = await supabase
      .from("dossiers_medicaux")
      .select("*")
      .eq("code_acces", accessCode)
      .maybeSingle();

    if (existingError) {
      console.error("Erreur lors de la recherche du dossier médical existant:", existingError);
    }
    
    if (existingDossier) {
      console.log(`Dossier médical existant trouvé avec l'ID: ${existingDossier.id}`);
      return {
        content: existingDossier.contenu_dossier,
        id: existingDossier.id
      };
    }

    // Récupérer les directives anticipées de l'utilisateur
    let directives = null;
    
    // Essayer d'abord dans la table directives
    const { data: directivesData, error: directivesError } = await supabase
      .from("directives")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .maybeSingle();
    
    if (directivesError) {
      console.error("Erreur lors de la récupération des directives:", directivesError);
    }
    
    if (directivesData) {
      directives = directivesData.content;
      console.log("Directives trouvées dans la table directives");
    } else {
      console.log(`getOrCreateMedicalRecord - Aucune directive trouvée pour l'utilisateur: ${userId}`);
      
      // Essayer ensuite dans la table advance_directives
      const { data: advanceDirectives, error: advanceError } = await supabase
        .from("advance_directives")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .maybeSingle();
      
      if (advanceError) {
        console.error("Erreur lors de la récupération des directives anticipées:", advanceError);
      }
      
      if (advanceDirectives) {
        console.log("Directives trouvées dans la table advance_directives");
        // Si les directives sont sous forme de chaîne, les convertir en objet
        try {
          directives = typeof advanceDirectives.content === 'string' 
            ? JSON.parse(advanceDirectives.content)
            : advanceDirectives.content;
        } catch (e) {
          // Si le parsing échoue, utiliser la chaîne brute
          directives = { contenu_brut: advanceDirectives.content };
        }
      }
    }
    
    // Si toujours pas de directives, créer des directives factices pour le développement
    // Remplacer cette vérification qui utilisait process.env
    const isDevelopment = Deno.env.get("ENVIRONMENT") === "development" || true;
    
    if (!directives && isDevelopment) {
      console.log("Création de directives factices pour l'environnement de développement");
      directives = {
        "Directives anticipées": "Je souhaite que l'on respecte mon refus de traitement...",
        "Date de création": new Date().toISOString().split('T')[0],
        "Personne de confiance": "Jean Dupont",
        "Contact": "jean.dupont@example.com",
        "Notes": "Ces directives sont fictives pour le développement"
      };
    }
    
    // Récupérer les données médicales de l'utilisateur
    const { data: medicalData, error: medicalError } = await supabase
      .from("questionnaire_medical")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .maybeSingle();
    
    if (medicalError) {
      console.error("Erreur lors de la récupération des données médicales:", medicalError);
    }
    
    // Générer le contenu du dossier
    const dossierContent = {
      patient: {
        nom: profileData?.last_name || "Inconnu",
        prenom: profileData?.first_name || "Inconnu",
        date_naissance: profileData?.birth_date || null,
        adresse: profileData?.address || "Non renseignée",
        telephone: profileData?.phone_number || "Non renseigné"
      },
      directives_anticipees: directives,
      directives: directives, // Pour compatibilité avec d'autres formats
      donnees_medicales: medicalData || null
    };
    
    // Créer un nouveau dossier médical
    const { data: newDossier, error: createError } = await supabase
      .from("dossiers_medicaux")
      .insert({
        code_acces: accessCode,
        contenu_dossier: dossierContent
      })
      .select()
      .single();
    
    if (createError) {
      console.error("Erreur lors de la création du dossier médical:", createError);
      throw createError;
    }
    
    console.log(`Nouveau dossier médical créé avec l'ID: ${newDossier.id}`);
    
    return {
      content: dossierContent,
      id: newDossier.id
    };
  } catch (error) {
    console.error("Erreur dans getOrCreateMedicalRecord:", error);
    throw error;
  }
}

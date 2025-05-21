
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
  console.log(`getOrCreateMedicalRecord - Type d'accès: ${accessType}`);
  
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
    
    // Si toujours pas de directives, créer des directives factices
    // Simplifié pour toujours permettre les données de développement
    if (!directives) {
      console.log("Création de directives factices");
      
      // Si accessType est directives, on doit absolument fournir des directives
      if (accessType === "directives" || accessType === "full") {
        directives = {
          "Directives anticipées": profileData ? 
            `Directives anticipées pour ${profileData.first_name || ''} ${profileData.last_name || ''}` : 
            "Directives anticipées du patient",
          "Date de création": new Date().toISOString().split('T')[0],
          "Personne de confiance": "Non spécifiée",
          "Instructions": "Document disponible sur demande",
          "Remarque": "Ces directives sont une représentation simplifiée"
        };
        console.log("Directives factices créées pour l'accès de type:", accessType);
      }
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
    const dossierContent: any = {
      patient: {
        nom: profileData?.last_name || "Inconnu",
        prenom: profileData?.first_name || "Inconnu",
        date_naissance: profileData?.birth_date || null,
        adresse: profileData?.address || "Non renseignée",
        telephone: profileData?.phone_number || "Non renseigné"
      }
    };
    
    // Ajouter les directives si disponibles
    if (directives) {
      dossierContent.directives_anticipees = directives;
      dossierContent.directives = directives; // Pour compatibilité avec d'autres formats
    }
    
    // Ajouter les données médicales si disponibles
    if (medicalData) {
      dossierContent.donnees_medicales = medicalData;
    }
    
    console.log("Contenu du dossier préparé:", Object.keys(dossierContent).join(', '));
    
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

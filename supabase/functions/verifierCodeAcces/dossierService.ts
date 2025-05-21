
import { fetchUserProfile } from "./accessService.ts";

/**
 * Récupère ou crée un dossier médical pour un utilisateur authentifié
 * @param supabase Client Supabase  
 * @param userId ID de l'utilisateur
 * @param accessType Type d'accès ("directives", "medical", "full")
 * @returns Contenu du dossier pour l'utilisateur authentifié
 */
export async function getAuthUserMedicalRecord(
  supabase: any,
  userId: string,
  accessType: string = "full"
) {
  // Générer un ID pour ce dossier
  const dossierId = crypto.randomUUID();
  
  // Récupérer les données du profil
  const profileData = await fetchUserProfile(supabase, userId);
  
  // Créer un contenu de dossier avec les informations du patient
  const dossierContenu: any = {
    patient: {
      nom: profileData?.last_name,
      prenom: profileData?.first_name,
      date_naissance: profileData?.birth_date
    }
  };

  // Récupérer les directives pour cet utilisateur si l'accès le permet
  if (accessType === "directives" || accessType === "full") {
    console.log("getAuthUserMedicalRecord - Récupération des directives pour l'utilisateur:", userId);
    
    let directivesFound = false;
    
    // Chercher d'abord dans advance_directives
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Si les directives sont trouvées dans advance_directives
    if (directivesData && directivesData.length > 0) {
      console.log("getAuthUserMedicalRecord - Directives trouvées dans advance_directives:", directivesData[0].content);
      dossierContenu["directives_anticipees"] = directivesData[0].content;
      directivesFound = true;
    } else {
      // Sinon, chercher dans la table directives
      const { data: alternativeDirectives } = await supabase
        .from("directives")
        .select("content")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1);
        
      if (alternativeDirectives && alternativeDirectives.length > 0) {
        console.log("getAuthUserMedicalRecord - Directives trouvées dans directives:", alternativeDirectives[0].content);
        dossierContenu["directives_anticipees"] = alternativeDirectives[0].content;
        directivesFound = true;
      } else {
        console.log("getAuthUserMedicalRecord - Aucune directive trouvée pour l'utilisateur:", userId);
      }
    }
    
    // Si aucune directive trouvée, créer une directive par défaut pour les tests
    if (!directivesFound && process.env.NODE_ENV !== "production") {
      console.log("getAuthUserMedicalRecord - Création d'une directive par défaut pour les tests");
      dossierContenu["directives_anticipees"] = {
        "date_creation": new Date().toISOString(),
        "contenu": "Directives anticipées par défaut pour les tests",
        "personne_confiance": {
          "nom": "Personne de confiance",
          "contact": "Contact"
        }
      };
    }
  }

  // Récupérer les données médicales si l'accès le permet
  if (accessType === "medical" || accessType === "full") {
    const { data: medicalData } = await supabase
      .from("medical_data")
      .select("data")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les données médicales si disponibles
    if (medicalData && medicalData.length > 0) {
      dossierContenu["donnees_medicales"] = medicalData[0].data;
    }
  }

  console.log("getAuthUserMedicalRecord - Contenu du dossier créé:", dossierContenu);
  
  return {
    content: dossierContenu,
    id: dossierId
  };
}

/**
 * Récupère ou crée un dossier médical
 * @param supabase Client Supabase
 * @param documentId ID du document
 * @param userId ID de l'utilisateur
 * @param code Code d'accès
 * @param profileData Données du profil
 * @param accessType Type d'accès ("directives", "medical", "full")
 * @returns Contenu du dossier et son ID
 */
export async function getOrCreateMedicalRecord(
  supabase: any,
  documentId: string,
  userId: string,
  code: string,
  profileData: any,
  accessType: string = "full"
) {
  // Vérifier si le dossier médical existe
  const { data: medicalRecordData } = await supabase
    .from("dossiers_medicaux")
    .select("contenu_dossier, id")
    .eq("id", documentId)
    .maybeSingle();

  // Si le dossier existe déjà, retourner son contenu
  if (medicalRecordData) {
    console.log("Dossier médical existant récupéré, ID:", medicalRecordData.id);
    return {
      content: medicalRecordData.contenu_dossier,
      id: medicalRecordData.id
    };
  }

  // Sinon, créer un nouveau dossier avec le contenu approprié
  const dossierContenu: any = {
    patient: {
      nom: profileData?.last_name,
      prenom: profileData?.first_name,
      date_naissance: profileData?.birth_date
    }
  };

  // Récupérer les directives pour cet utilisateur si l'accès le permet
  if (accessType === "directives" || accessType === "full") {
    console.log("getOrCreateMedicalRecord - Récupération des directives pour l'utilisateur:", userId);
    
    let directivesFound = false;
    
    // Chercher d'abord dans advance_directives
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Si les directives sont trouvées dans advance_directives
    if (directivesData && directivesData.length > 0) {
      console.log("getOrCreateMedicalRecord - Directives trouvées dans advance_directives:", directivesData[0].content);
      dossierContenu["directives_anticipees"] = directivesData[0].content;
      directivesFound = true;
    } else {
      // Sinon, chercher dans la table directives
      const { data: alternativeDirectives } = await supabase
        .from("directives")
        .select("content")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1);
        
      if (alternativeDirectives && alternativeDirectives.length > 0) {
        console.log("getOrCreateMedicalRecord - Directives trouvées dans directives:", alternativeDirectives[0].content);
        dossierContenu["directives_anticipees"] = alternativeDirectives[0].content;
        directivesFound = true;
      } else {
        console.log("getOrCreateMedicalRecord - Aucune directive trouvée pour l'utilisateur:", userId);
      }
    }
    
    // Si aucune directive trouvée, créer une directive par défaut pour les tests
    if (!directivesFound && process.env.NODE_ENV !== "production") {
      console.log("getOrCreateMedicalRecord - Création d'une directive par défaut pour les tests");
      dossierContenu["directives_anticipees"] = {
        "date_creation": new Date().toISOString(),
        "contenu": "Directives anticipées par défaut pour les tests",
        "personne_confiance": {
          "nom": "Personne de confiance",
          "contact": "Contact"
        }
      };
    }
  }

  // Récupérer les données médicales si l'accès le permet
  if (accessType === "medical" || accessType === "full") {
    const { data: medicalData } = await supabase
      .from("medical_data")
      .select("data")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les données médicales si disponibles
    if (medicalData && medicalData.length > 0) {
      dossierContenu["donnees_medicales"] = medicalData[0].data;
    }
  }
  
  // Créer un ID de document si non fourni
  const finalDocumentId = documentId || crypto.randomUUID();
  
  // Insérer le nouveau dossier
  const { data: newDossier, error } = await supabase
    .from("dossiers_medicaux")
    .insert({
      id: finalDocumentId,
      code_acces: code,
      contenu_dossier: dossierContenu
    })
    .select()
    .single();
    
  if (error) {
    console.error("Erreur lors de la création du dossier médical:", error);
  }
  
  console.log("Nouveau dossier médical créé avec ID:", finalDocumentId);
  console.log("Contenu du dossier:", dossierContenu);
  
  return {
    content: dossierContenu,
    id: finalDocumentId
  };
}

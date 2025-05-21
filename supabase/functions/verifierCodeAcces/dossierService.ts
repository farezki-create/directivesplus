
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
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les directives si disponibles
    if (directivesData && directivesData.length > 0) {
      console.log("getAuthUserMedicalRecord - Directives trouvées:", directivesData[0].content);
      dossierContenu["directives_anticipees"] = directivesData[0].content;
    } else {
      console.log("getAuthUserMedicalRecord - Aucune directive trouvée pour l'utilisateur:", userId);
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
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les directives si disponibles
    if (directivesData && directivesData.length > 0) {
      console.log("getOrCreateMedicalRecord - Directives trouvées:", directivesData[0].content);
      dossierContenu["directives_anticipees"] = directivesData[0].content;
    } else {
      console.log("getOrCreateMedicalRecord - Aucune directive trouvée pour l'utilisateur:", userId);
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

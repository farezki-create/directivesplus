
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Définition des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Interface pour la requête
interface RequestBody {
  code_saisi: string;
  bruteForceIdentifier?: string;
  isAuthUserRequest?: boolean;
  userId?: string;
}

// Interface pour les réponses standardisées
interface StandardResponse {
  success: boolean;
  error?: string;
  dossier?: {
    id: string;
    userId: string;
    isFullAccess: boolean;
    isDirectivesOnly: boolean;
    isMedicalOnly: boolean;
    profileData?: any;
    contenu?: any;
  };
}

/**
 * Créer un client Supabase avec les droits d'administrateur
 * @returns Client Supabase configuré
 */
function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Configuration Supabase manquante");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Journalise une tentative d'accès
 * @param supabase Client Supabase
 * @param userId ID de l'utilisateur
 * @param success Succès de la tentative
 * @param details Détails supplémentaires
 * @param accessCodeId ID du code d'accès (optionnel)
 */
async function logAccessAttempt(
  supabase: any,
  userId: string | null,
  success: boolean,
  details: string,
  accessCodeId: string | null = null
) {
  try {
    await supabase.from("document_access_logs").insert({
      user_id: userId || "00000000-0000-0000-0000-000000000000",
      access_code_id: accessCodeId,
      nom_consultant: "Access via Edge Function",
      prenom_consultant: "System",
      success,
      details
    });
  } catch (error) {
    console.error("Erreur de journalisation:", error);
  }
}

/**
 * Vérifie l'existence d'un code d'accès
 * @param supabase Client Supabase
 * @param code Code d'accès à vérifier
 * @returns Données du code d'accès ou null
 */
async function verifyAccessCode(supabase: any, code: string) {
  try {
    // Remove type_access from the select query since it may not exist
    const { data, error } = await supabase
      .from("document_access_codes")
      .select("id, user_id, document_id, is_full_access")
      .eq("access_code", code)
      .maybeSingle();

    if (error) {
      console.error("Erreur Supabase lors de la vérification du code:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception lors de la vérification du code d'accès:", err);
    return null;
  }
}

/**
 * Récupère les données du profil utilisateur
 * @param supabase Client Supabase
 * @param userId ID de l'utilisateur
 * @returns Données du profil ou null
 */
async function fetchUserProfile(supabase: any, userId: string) {
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  return profileData;
}

/**
 * Récupère ou crée un dossier médical pour un utilisateur authentifié
 * @param supabase Client Supabase  
 * @param userId ID de l'utilisateur
 * @returns Contenu du dossier pour l'utilisateur authentifié
 */
async function getAuthUserMedicalRecord(
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
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les directives si disponibles
    if (directivesData && directivesData.length > 0) {
      dossierContenu["directives_anticipees"] = directivesData[0].content;
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
async function getOrCreateMedicalRecord(
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
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ajouter les directives si disponibles
    if (directivesData && directivesData.length > 0) {
      dossierContenu["directives_anticipees"] = directivesData[0].content;
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
  
  // Insérer le nouveau dossier
  const { data: newDossier } = await supabase
    .from("dossiers_medicaux")
    .insert({
      id: documentId,
      code_acces: code,
      contenu_dossier: dossierContenu
    })
    .select()
    .single();
  
  console.log("Nouveau dossier médical créé avec ID:", documentId);
  
  return {
    content: dossierContenu,
    id: documentId
  };
}

/**
 * Gestionnaire principal des requêtes
 */
serve(async (req: Request) => {
  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Vérification que la méthode est POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Récupération et validation du corps de la requête
    const reqBody = await req.json() as RequestBody;
    const { code_saisi, bruteForceIdentifier, isAuthUserRequest, userId: requestUserId } = reqBody;

    // Cas spécial: requête pour un utilisateur authentifié
    if (isAuthUserRequest && requestUserId) {
      console.log("Requête pour utilisateur authentifié:", requestUserId);
      
      // Création du client Supabase
      const supabase = createSupabaseClient();
      
      // Déterminer le type d'accès demandé basé sur l'identifiant bruteForceIdentifier
      let accessType = "full"; 
      let isDirectivesOnly = false;
      let isMedicalOnly = false;
      
      if (bruteForceIdentifier && typeof bruteForceIdentifier === "string") {
        if (bruteForceIdentifier.includes("directives_access")) {
          accessType = "directives";
          isDirectivesOnly = true;
        } else if (bruteForceIdentifier.includes("medical_access")) {
          accessType = "medical";
          isMedicalOnly = true;
        }
      }
      
      // Récupérer les données du profil
      const profileData = await fetchUserProfile(supabase, requestUserId);
      
      // Récupérer le dossier pour l'utilisateur authentifié
      const { content: dossierContent, id: dossierId } = await getAuthUserMedicalRecord(
        supabase,
        requestUserId,
        accessType
      );
      
      // Journaliser l'accès réussi
      await logAccessAttempt(
        supabase, 
        requestUserId, 
        true, 
        `Accès de l'utilisateur authentifié à son propre dossier`, 
        null
      );
      
      // Création de la réponse réussie
      const successResponse: StandardResponse = {
        success: true,
        dossier: {
          id: dossierId,
          userId: requestUserId,
          isFullAccess: true,
          isDirectivesOnly: isDirectivesOnly,
          isMedicalOnly: isMedicalOnly,
          profileData: profileData,
          contenu: dossierContent
        },
      };
      
      // Retour de la réponse
      return new Response(
        JSON.stringify(successResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Mode normal: validation par code d'accès
    if (!code_saisi || typeof code_saisi !== "string") {
      return new Response(
        JSON.stringify({ error: "Code d'accès invalide ou manquant" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Création du client Supabase
    const supabase = createSupabaseClient();

    // Vérification du code d'accès
    const accessCodeData = await verifyAccessCode(supabase, code_saisi);

    // Si le code d'accès n'existe pas
    if (!accessCodeData) {
      await logAccessAttempt(supabase, null, false, "Code d'accès invalide");
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Code d'accès invalide ou dossier non trouvé" 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extraction des données du code d'accès
    const userId = accessCodeData.user_id;
    const documentId = accessCodeData.document_id;
    const isFullAccess = accessCodeData.is_full_access || false;
    
    // Déterminons le type d'accès en fonction du contexte
    // Puisque la colonne type_access n'existe pas, nous utiliserons une heuristique simple
    // basée sur le bruteForceIdentifier qui contient des indices sur le type d'accès demandé
    let accessType = "full"; // valeur par défaut
    let isDirectivesOnly = false;
    let isMedicalOnly = false;
    
    if (bruteForceIdentifier && typeof bruteForceIdentifier === "string") {
      if (bruteForceIdentifier.includes("directives_access")) {
        accessType = "directives";
        isDirectivesOnly = true;
      } else if (bruteForceIdentifier.includes("medical_access")) {
        accessType = "medical";
        isMedicalOnly = true;
      }
    }
    
    // Récupération des données du profil
    const profileData = await fetchUserProfile(supabase, userId);

    // Récupération ou création du dossier médical
    const { content: dossierContent, id: dossierId } = await getOrCreateMedicalRecord(
      supabase,
      documentId,
      userId,
      code_saisi,
      profileData,
      accessType
    );

    // Journalisation de l'accès réussi
    await logAccessAttempt(
      supabase, 
      userId, 
      true, 
      `Accès valide au dossier ${dossierId}`, 
      accessCodeData.id
    );

    // Création de la réponse réussie
    const successResponse: StandardResponse = {
      success: true,
      dossier: {
        id: dossierId,
        userId: userId,
        isFullAccess: isFullAccess,
        isDirectivesOnly: isDirectivesOnly,
        isMedicalOnly: isMedicalOnly,
        profileData: profileData,
        contenu: dossierContent
      },
    };

    // Retour de la réponse
    return new Response(
      JSON.stringify(successResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Une erreur est survenue lors de la vérification du code d'accès",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

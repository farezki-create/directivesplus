
import { StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { getOrCreateMedicalRecord } from "./dossierService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { corsHeaders } from "./corsHelpers.ts";

/**
 * Gère les requêtes d'accès pour les utilisateurs authentifiés
 * @param userId ID de l'utilisateur authentifié
 * @param bruteForceIdentifier Identifiant pour le contexte d'accès
 * @returns Réponse avec les données du dossier ou message d'erreur
 */
export async function handleAuthenticatedUserRequest(
  userId: string,
  bruteForceIdentifier?: string
): Promise<Response> {
  console.log(`Requête pour utilisateur authentifié: ${userId}`);

  // Validation de l'ID utilisateur
  if (!userId || typeof userId !== "string") {
    return new Response(
      JSON.stringify({ success: false, error: "ID utilisateur invalide ou manquant" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Création du client Supabase
  const supabase = createSupabaseClient();

  try {
    // Déterminons le type d'accès en fonction du bruteForceIdentifier
    let accessType = "full"; // valeur par défaut
    if (bruteForceIdentifier && bruteForceIdentifier.includes("directives_access")) {
      accessType = "directives";
    } else if (bruteForceIdentifier && bruteForceIdentifier.includes("medical_access")) {
      accessType = "medical";
    }

    // Récupération des données du profil
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profileData) {
      console.error("Erreur lors de la récupération du profil:", profileError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Profil utilisateur non trouvé",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Récupération du code d'accès approprié selon le type
    const codeFieldName = accessType === "medical" ? "medical_access_code" : "document_access_codes";
    
    // Si on cherche un code de directives, interroger la table document_access_codes
    let accessCode;
    
    if (accessType === "directives") {
      const { data: accessCodes, error: accessError } = await supabase
        .from("document_access_codes")
        .select("access_code")
        .eq("user_id", userId)
        .eq("is_full_access", false)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (accessError) {
        console.error("Erreur lors de la récupération du code d'accès:", accessError);
      }
      
      accessCode = accessCodes && accessCodes.length > 0 ? accessCodes[0].access_code : null;
    } else {
      // Sinon, utiliser le code du profil
      accessCode = profileData.medical_access_code;
    }

    if (!accessCode) {
      // Si pas de code d'accès, on en crée un nouveau pour les directives
      if (accessType === "directives") {
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        accessCode = randomCode;
        
        const { error: insertError } = await supabase
          .from("document_access_codes")
          .insert({
            user_id: userId,
            access_code: accessCode,
            is_full_access: false
          });
        
        if (insertError) {
          console.error("Erreur lors de la création du code d'accès:", insertError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Impossible de créer un code d'accès",
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } else {
        // Pour les données médicales, c'est obligatoire d'avoir un code
        return new Response(
          JSON.stringify({
            success: false,
            error: "Aucun code d'accès médical n'est disponible pour cet utilisateur",
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Récupération ou création du dossier médical
    const { content: dossierContent, id: dossierId } = await getOrCreateMedicalRecord(
      supabase,
      null, // Pas de document ID spécifique
      userId,
      accessCode,
      profileData,
      accessType
    );

    // Journalisation de l'accès
    await logAccessAttempt(
      supabase,
      userId,
      true,
      `Accès authentifié au dossier ${dossierId}`
    );

    // Création de la réponse réussie
    const successResponse: StandardResponse = {
      success: true,
      dossier: {
        id: dossierId,
        userId: userId,
        isFullAccess: true,
        isDirectivesOnly: accessType === "directives",
        isMedicalOnly: accessType === "medical",
        profileData: profileData,
        contenu: dossierContent,
      },
    };

    // Retour de la réponse
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors du traitement de la requête authentifiée:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Une erreur est survenue lors du traitement de la requête",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

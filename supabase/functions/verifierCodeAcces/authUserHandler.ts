
import { StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { getOrCreateMedicalRecord } from "./dossierService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { corsHeaders } from "./corsHelpers.ts";
import { determineAccessType } from "./accessTypeUtils.ts";
import { 
  getOrCreateMedicalAccessCode, 
  getOrCreateDirectivesAccessCode 
} from "./accessCodeGenerator.ts";
import { fetchUserProfile } from "./profileService.ts";

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
    // Déterminer le type d'accès
    const { accessType, isDirectivesOnly, isMedicalOnly } = determineAccessType(bruteForceIdentifier);
    
    // Récupération des données du profil
    const profileData = await fetchUserProfile(supabase, userId);

    // Récupération du code d'accès approprié selon le type
    let accessCode;
    
    if (accessType === "medical") {
      accessCode = await getOrCreateMedicalAccessCode(supabase, userId);
    } else {
      accessCode = await getOrCreateDirectivesAccessCode(supabase, userId);
    }
    
    console.log("Code d'accès utilisé pour le dossier:", accessCode);

    // Récupération ou création du dossier médical
    try {
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

      console.log(`Dossier récupéré avec succès. ID: ${dossierId}, Type: ${accessType}`);

      // Création de la réponse réussie
      const successResponse: StandardResponse = {
        success: true,
        dossier: {
          id: dossierId,
          userId: userId,
          isFullAccess: accessType === "full",
          isDirectivesOnly: isDirectivesOnly,
          isMedicalOnly: isMedicalOnly,
          profileData: profileData,
          contenu: dossierContent,
        },
      };

      // Retour de la réponse
      return new Response(JSON.stringify(successResponse), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (dossierError: any) {
      console.error("Erreur lors de la récupération/création du dossier:", dossierError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erreur lors de la récupération du dossier: ${dossierError.message || "Erreur inconnue"}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    console.error("Erreur lors du traitement de la requête authentifiée:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur est survenue lors du traitement de la requête",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

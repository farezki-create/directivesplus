
import { StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { fetchUserProfile } from "./accessService.ts";
import { getOrCreateMedicalRecord } from "./dossierService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { corsHeaders } from "./corsHelpers.ts";

/**
 * Gère les requêtes pour les utilisateurs authentifiés
 * @param userId ID de l'utilisateur authentifié
 * @param bruteForceIdentifier Identifiant pour le contexte d'accès
 * @returns Réponse avec les données du dossier ou message d'erreur
 */
export async function handleAuthenticatedUserRequest(
  userId: string,
  bruteForceIdentifier?: string
): Promise<Response> {
  console.log("Requête pour utilisateur authentifié:", userId);
  
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
  const profileData = await fetchUserProfile(supabase, userId);
  
  // Récupérer le dossier pour l'utilisateur authentifié
  const { content: dossierContent, id: dossierId } = await getOrCreateMedicalRecord(
    supabase,
    null, // Pas de document ID pour un utilisateur authentifié
    userId,
    "auth_user_" + userId.substring(0, 8), // Code d'accès généré pour l'utilisateur auth
    profileData,
    accessType
  );
  
  // Journaliser l'accès réussi
  await logAccessAttempt(
    supabase, 
    userId, 
    true, 
    `Accès de l'utilisateur authentifié à son propre dossier`, 
    null
  );
  
  // Création de la réponse réussie
  const successResponse: StandardResponse = {
    success: true,
    dossier: {
      id: dossierId,
      userId: userId,
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

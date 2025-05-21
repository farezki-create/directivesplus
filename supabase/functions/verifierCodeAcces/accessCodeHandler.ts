
import { StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { verifyAccessCode, fetchUserProfile } from "./accessService.ts";
import { getOrCreateMedicalRecord } from "./dossierService.ts";
import { logAccessAttempt } from "./loggingService.ts";
import { corsHeaders } from "./corsHelpers.ts";

/**
 * Gère les requêtes d'accès par code
 * @param code Code d'accès saisi
 * @param bruteForceIdentifier Identifiant pour le contexte d'accès
 * @returns Réponse avec les données du dossier ou message d'erreur
 */
export async function handleAccessCodeRequest(
  code: string,
  bruteForceIdentifier?: string
): Promise<Response> {
  // Validation du code d'accès
  if (!code || typeof code !== "string") {
    return new Response(
      JSON.stringify({ success: false, error: "Code d'accès invalide ou manquant" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Création du client Supabase
  const supabase = createSupabaseClient();

  // Vérification du code d'accès
  const accessCodeData = await verifyAccessCode(supabase, code);

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
  
  // Déterminons le type d'accès en fonction du contexte basé sur le bruteForceIdentifier
  let accessType = "full"; // valeur par défaut
  let isDirectivesOnly = false;
  let isMedicalOnly = false;
  
  if (bruteForceIdentifier && typeof bruteForceIdentifier === "string") {
    if (bruteForceIdentifier.includes("directives_access")) {
      accessType = "directives";
      isDirectivesOnly = true;
      isMedicalOnly = false;
    } else if (bruteForceIdentifier.includes("medical_access")) {
      accessType = "medical";
      isMedicalOnly = true;
      isDirectivesOnly = false;
    }
  }
  
  // Récupération des données du profil
  const profileData = await fetchUserProfile(supabase, userId);

  // Récupération ou création du dossier médical
  const { content: dossierContent, id: dossierId } = await getOrCreateMedicalRecord(
    supabase,
    documentId,
    userId,
    code,
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

  console.log(`Accès validé - Type: ${accessType}, DirectivesOnly: ${isDirectivesOnly}, MedicalOnly: ${isMedicalOnly}`);

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
}

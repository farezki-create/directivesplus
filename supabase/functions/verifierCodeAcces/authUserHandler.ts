
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
    let isDirectivesOnly = false;
    let isMedicalOnly = false;
    
    if (bruteForceIdentifier) {
      if (bruteForceIdentifier.includes("directives_access")) {
        accessType = "directives";
        isDirectivesOnly = true;
        isMedicalOnly = false;
        console.log("Type d'accès défini: directives uniquement");
      } else if (bruteForceIdentifier.includes("medical_access")) {
        accessType = "medical";
        isMedicalOnly = true;
        isDirectivesOnly = false;
        console.log("Type d'accès défini: médical uniquement");
      } else {
        console.log("Type d'accès défini: complet (par défaut)");
      }
    }
    
    console.log(`Type d'accès déterminé: ${accessType}, DirectivesOnly: ${isDirectivesOnly}, MedicalOnly: ${isMedicalOnly}`);

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
    let accessCode;
    
    if (accessType === "medical") {
      accessCode = profileData.medical_access_code;
      console.log("Utilisation du code d'accès médical:", accessCode);
    } else {
      // Pour les directives ou l'accès complet, chercher dans la table document_access_codes
      const { data: accessCodes, error: accessError } = await supabase
        .from("document_access_codes")
        .select("access_code")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (accessError) {
        console.error("Erreur lors de la récupération du code d'accès:", accessError);
      }
      
      accessCode = accessCodes && accessCodes.length > 0 ? accessCodes[0].access_code : null;
      console.log("Utilisation du code d'accès de directives:", accessCode);
    }

    if (!accessCode) {
      // Si pas de code d'accès, on en crée un nouveau
      try {
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        accessCode = randomCode;
        
        if (accessType === "medical") {
          // Mettre à jour le profil avec le code d'accès médical
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ medical_access_code: accessCode })
            .eq("id", userId);
          
          if (updateError) {
            console.error("Erreur lors de la mise à jour du code d'accès médical:", updateError);
            return new Response(
              JSON.stringify({
                success: false,
                error: "Impossible de créer un code d'accès médical",
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
          
          console.log("Nouveau code d'accès médical créé:", accessCode);
        } else {
          // Créer un nouveau code d'accès pour les directives
          const { error: insertError } = await supabase
            .from("document_access_codes")
            .insert({
              user_id: userId,
              access_code: accessCode,
              is_full_access: false
            });
          
          if (insertError) {
            console.error("Erreur lors de la création du code d'accès de directives:", insertError);
            return new Response(
              JSON.stringify({
                success: false,
                error: "Impossible de créer un code d'accès de directives",
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
          
          console.log("Nouveau code d'accès de directives créé:", accessCode);
        }
      } catch (codeError) {
        console.error("Erreur lors de la génération du code d'accès:", codeError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Erreur lors de la génération du code d'accès",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
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

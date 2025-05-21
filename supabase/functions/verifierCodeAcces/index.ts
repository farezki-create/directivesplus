
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { RequestBody } from "./types.ts";
import { corsHeaders, handleCorsRequest } from "./corsHelpers.ts";
import { handleAuthenticatedUserRequest } from "./authUserHandler.ts";
import { handleAccessCodeRequest } from "./accessCodeHandler.ts";

/**
 * Gestionnaire principal des requêtes
 */
serve(async (req: Request) => {
  // Gestion des requêtes OPTIONS (CORS preflight)
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Vérification que la méthode est POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Méthode non autorisée" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Récupération et validation du corps de la requête
    const reqBody = await req.json() as RequestBody;
    const { code_saisi, bruteForceIdentifier, isAuthUserRequest, userId } = reqBody;

    // Cas spécial: requête pour un utilisateur authentifié
    if (isAuthUserRequest && userId) {
      return await handleAuthenticatedUserRequest(userId, bruteForceIdentifier);
    }

    // Mode normal: validation par code d'accès
    return await handleAccessCodeRequest(code_saisi, bruteForceIdentifier);
    
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


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./corsHelpers.ts";
import { RequestBody, StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { verifyAccessCode } from "./accessCodeVerifier.ts";
import { getAuthenticatedUserDossier } from "./authenticatedAccess.ts";
import { logAccessAttempt } from "./loggingService.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const requestBody: RequestBody = await req.json();
    const { 
      accessCode, 
      bruteForceIdentifier, 
      userId, 
      accessType,
      patientName,
      patientBirthDate
    } = requestBody;

    const supabase = createSupabaseClient();
    
    if (userId) {
      const result = await getAuthenticatedUserDossier(supabase, userId, accessType);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400,
      });
    } 
    
    else if (accessCode) {
      const result = await verifyAccessCode(
        supabase, 
        accessCode, 
        bruteForceIdentifier,
        patientName,
        patientBirthDate
      );

      if (!result.success) {
        await logAccessAttempt(
          supabase,
          null, 
          false, 
          `Tentative échouée avec code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`
        );
      }
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400,
      });
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Paramètres d'accès manquants ou invalides"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur est survenue lors de la vérification"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

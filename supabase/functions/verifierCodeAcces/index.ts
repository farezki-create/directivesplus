
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
      // SECURITY: Require JWT auth, and the authenticated user must match the requested userId
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ success: false, error: "Authentification requise" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !userData?.user) {
        return new Response(
          JSON.stringify({ success: false, error: "Token invalide" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
      if (userData.user.id !== userId) {
        return new Response(
          JSON.stringify({ success: false, error: "Accès refusé" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }

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


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./corsHelpers.ts";
import { RequestBody, StandardResponse } from "./types.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { verifyAccessCode } from "./accessCodeVerifier.ts";
import { getAuthenticatedUserDossier } from "./authenticatedAccess.ts";
import { logAccessAttempt } from "./loggingService.ts";

// Main handler function for the Edge Function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("verifierCodeAcces function called");
    
    const requestBody: RequestBody = await req.json();
    const { 
      accessCode, 
      bruteForceIdentifier, 
      userId, 
      accessType,
      patientName,
      patientBirthDate
    } = requestBody;
    
    console.log("Request params:", { 
      hasAccessCode: !!accessCode, 
      hasPatientName: !!patientName, 
      hasPatientBirthDate: !!patientBirthDate,
      identifier: bruteForceIdentifier,
      hasUserId: !!userId,
      accessType
    });

    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    // Handle authenticated user access flow
    if (userId) {
      console.log("Handling authenticated user access for userId:", userId);
      const result = await getAuthenticatedUserDossier(supabase, userId, accessType);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400,
      });
    } 
    
    // Handle access code flow
    else if (accessCode) {
      console.log("Handling code access with code:", accessCode);
      
      const result = await verifyAccessCode(
        supabase, 
        accessCode, 
        bruteForceIdentifier,
        patientName,
        patientBirthDate
      );

      // If verification failed, log the attempt
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

    // If no valid access parameters provided
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

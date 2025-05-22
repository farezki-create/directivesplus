
// verifierCodeAcces edge function - Gère la vérification des codes d'accès
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { fetchUserProfile } from "./profileService.ts";
import { getOrCreateMedicalRecord } from "./dossierService.ts";
import { determineAccessType } from "./accessTypeUtils.ts";
import { createSupabaseClient } from "./supabaseClient.ts";
import { logAccessAttempt } from "./loggingService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Edge Function verifierCodeAcces initialized");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createSupabaseClient();
    
    // Parse request
    const { accessCode, patientName, patientBirthDate, userId, documentId, bruteForceIdentifier } = await req.json();
    
    console.log(`Tentative d'accès avec le code: ${accessCode?.substring(0, 3)}*** pour ${patientName || 'utilisateur inconnu'}`);
    console.log(`Identifiant anti-bruteforce: ${bruteForceIdentifier || 'non fourni'}`);
    
    // Validate input
    if (!accessCode) {
      console.log("Code d'accès manquant dans la requête");
      return new Response(
        JSON.stringify({ success: false, error: "Code d'accès invalide ou manquant" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Log access attempt for security monitoring
    await logAccessAttempt(supabase, accessCode, bruteForceIdentifier || "unknown", patientName);
    
    // Determine access type based on context identifier
    const { accessType, isDirectivesOnly, isMedicalOnly } = determineAccessType(bruteForceIdentifier);
    console.log(`Type d'accès déterminé: ${accessType}`);

    // Verify code in database (simulation for demo)
    // Dans une vraie implémentation, nous vérifierions le code dans la base de données
    // Pour cette démo, nous acceptons tous les codes de 8 caractères ou plus
    const isValidCode = accessCode && accessCode.length >= 8;
    
    if (!isValidCode) {
      console.log("Code d'accès invalide (trop court)");
      return new Response(
        JSON.stringify({ success: false, error: "Code d'accès invalide" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Fetch user profile if authenticated or extract from parameters
    let user_id = userId || null;
    let profile = null;
    
    if (user_id) {
      profile = await fetchUserProfile(supabase, user_id);
    } else {
      // Create minimal profile from request data for unauthenticated access
      profile = {
        first_name: patientName?.split(' ')[0] || "Utilisateur",
        last_name: patientName?.split(' ').slice(1).join(' ') || "Non identifié",
        birth_date: patientBirthDate || null,
      };
    }
    
    console.log(`Récupération du dossier pour l'utilisateur: ${user_id || 'anonyme'}`);
    
    // Get or create medical record with appropriate access
    const dossier = await getOrCreateMedicalRecord(
      supabase,
      documentId,
      user_id || "public_" + new Date().getTime(),
      accessCode,
      profile,
      accessType
    );
    
    // Return the response with the dossier
    const response = {
      success: true,
      dossier: {
        id: dossier.id,
        userId: user_id || "anonymous",
        isFullAccess: accessType === "full",
        isDirectivesOnly,
        isMedicalOnly,
        profileData: profile,
        contenu: dossier.content
      }
    };
    
    console.log(`Accès autorisé avec le code ${accessCode?.substring(0, 3)}***, ID dossier: ${dossier.id}`);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Erreur lors du traitement de la requête:`, error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erreur interne du serveur" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

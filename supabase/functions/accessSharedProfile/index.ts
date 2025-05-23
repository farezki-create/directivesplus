
// Follow Deno edge function conventions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { firstName, lastName, birthdate, accessCode } = body;
    
    // Validate inputs
    if (!firstName || !lastName || !birthdate || !accessCode) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tous les champs sont requis",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query shared_profiles with provided credentials
    const { data, error } = await supabase
      .from("shared_profiles")
      .select("*, medical_profile_id")
      .eq("first_name", firstName)
      .eq("last_name", lastName)
      .eq("birthdate", birthdate)
      .eq("access_code", accessCode)
      .maybeSingle();

    if (error || !data) {
      console.error("Database query error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Informations incorrectes ou accès expiré",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create dossier object from shared profile
    const dossier = {
      id: data.id,
      userId: data.user_id || null,
      medical_profile_id: data.medical_profile_id,
      isFullAccess: true,
      isDirectivesOnly: true,
      isMedicalOnly: false,
      profileData: {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birthdate
      },
      contenu: {
        patient: {
          nom: data.last_name,
          prenom: data.first_name,
          date_naissance: data.birthdate
        }
      }
    };

    // Log access for audit purposes
    await supabase.from("document_access_logs").insert({
      user_id: data.user_id || null,
      access_code_id: data.id,
      nom_consultant: lastName,
      prenom_consultant: firstName,
      ip_address: req.headers.get("cf-connecting-ip") || null,
      user_agent: req.headers.get("user-agent") || null
    }).select();

    return new Response(
      JSON.stringify({
        success: true,
        dossier: dossier,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Edge function error:", err);
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
});

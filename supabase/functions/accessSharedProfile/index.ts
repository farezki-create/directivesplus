
// Follow Deno edge function conventions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Input validation schema
const accessSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, 'Prénom requis')
    .max(100, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères invalides dans le prénom'),
  lastName: z.string()
    .trim()
    .min(1, 'Nom requis')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères invalides dans le nom'),
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine((date) => {
      const d = new Date(date);
      const now = new Date();
      const min = new Date('1900-01-01');
      return d >= min && d <= now && !isNaN(d.getTime());
    }, 'Date de naissance invalide'),
  accessCode: z.string()
    .trim()
    .regex(/^[A-Z0-9]{8,12}$/, 'Format de code d\'accès invalide')
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Limit request body size
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10000) {
      return new Response(
        JSON.stringify({ success: false, error: "Requête trop volumineuse" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = accessSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: validation.error.errors[0]?.message || "Données invalides",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { firstName, lastName, birthdate, accessCode } = validation.data;

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

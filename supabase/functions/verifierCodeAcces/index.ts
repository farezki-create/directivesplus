
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Définition des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Interface pour la requête
interface RequestBody {
  code_saisi: string;
}

serve(async (req: Request) => {
  // Gestion des requêtes OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Vérification que la méthode est POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Récupération et validation du corps de la requête
    const { code_saisi } = await req.json() as RequestBody;

    if (!code_saisi || typeof code_saisi !== "string") {
      return new Response(
        JSON.stringify({ error: "Code d'accès invalide ou manquant" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Création du client Supabase avec les droits d'administrateur
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Configuration Supabase manquante" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Vérification du code d'accès
    const { data, error } = await supabase
      .from("document_access_codes")
      .select("user_id, document_id, is_full_access")
      .eq("access_code", code_saisi)
      .maybeSingle();

    if (error) {
      console.error("Erreur Supabase:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Erreur de base de données" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Journalisation de la tentative d'accès
    const logAccess = async (userId: string | null, success: boolean, details: string) => {
      try {
        await supabase.from("document_access_logs").insert({
          user_id: userId || "00000000-0000-0000-0000-000000000000",
          access_code_id: data?.id || null,
          nom_consultant: "Access via Edge Function",
          prenom_consultant: "System",
          success,
          details
        });
      } catch (error) {
        console.error("Erreur de journalisation:", error);
      }
    };

    // Si le code d'accès n'existe pas
    if (!data) {
      await logAccess(null, false, "Code d'accès invalide");
      
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

    // Si le code d'accès existe, récupérer les données du document associé
    const userId = data.user_id;
    
    // Récupérer les données du profil pour vérifier plus tard
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Get directives for this user, to include in the medical record
    const { data: directivesData } = await supabase
      .from("advance_directives")
      .select("content")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    // Ensure we record this access
    await logAccess(userId, true, "Code d'accès valide");

    // Create or update medical record with directives content
    if (directivesData && directivesData.length > 0) {
      console.log("Copie des directives anticipées vers le dossier médical");
      
      // Check if a medical record exists for this user
      const { data: existingMedicalData } = await supabase
        .from("dossiers_medicaux")
        .select("id, contenu_dossier")
        .eq("code_acces", code_saisi)
        .maybeSingle();

      if (existingMedicalData) {
        // Update existing medical record to include directives
        const updatedContent = {
          ...existingMedicalData.contenu_dossier,
          directives_anticipees: directivesData[0].content
        };
        
        await supabase
          .from("dossiers_medicaux")
          .update({ contenu_dossier: updatedContent })
          .eq("id", existingMedicalData.id);
      } else {
        // Create new medical record with directives
        await supabase
          .from("dossiers_medicaux")
          .insert({
            code_acces: code_saisi,
            contenu_dossier: {
              directives_anticipees: directivesData[0].content,
              patient: {
                nom: profileData?.last_name,
                prenom: profileData?.first_name,
                date_naissance: profileData?.birth_date
              }
            }
          });
      }
    }

    // Retourner les informations du dossier
    return new Response(
      JSON.stringify({
        success: true,
        dossier: {
          id: data.document_id || "general_access",
          userId: userId,
          isFullAccess: data.is_full_access,
          profileData: profileData
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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

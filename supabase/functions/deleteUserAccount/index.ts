
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Définition des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

    // Extraction du token d'autorisation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Autorisation manquante" }),
        {
          status: 401,
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
    const adminAuthClient = supabase.auth.admin;

    // Vérification de l'utilisateur à partir du token
    const { data: userResponse, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !userResponse.user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non autorisé ou invalide" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = userResponse.user.id;

    // Suppression des données associées à l'utilisateur
    // Note: La suppression en cascade devrait fonctionner si les contraintes de clés étrangères
    // sont correctement configurées dans la base de données
    
    // 1. Suppression des documents PDF
    await supabase.from("pdf_documents").delete().eq("user_id", userId);
    
    // 2. Suppression des documents médicaux
    await supabase.from("medical_documents").delete().eq("user_id", userId);
    
    // 3. Suppression des dossiers médicaux (si liés à l'utilisateur)
    // Cette étape dépend de votre schéma de base de données
    
    // 4. Suppression des directives
    await supabase.from("directives").delete().eq("user_id", userId);
    
    // 5. Suppression des informations de profil
    await supabase.from("profiles").delete().eq("id", userId);
    
    // 6. Supprimer d'autres données si nécessaire
    // Ajouter d'autres suppressions spécifiques au projet ici
    
    // 7. Enfin, supprimer le compte utilisateur lui-même
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Compte et données associées supprimés avec succès",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Une erreur est survenue lors de la suppression du compte",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

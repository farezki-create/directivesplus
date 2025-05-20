
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
    console.log(`Début de la suppression du compte pour l'utilisateur: ${userId}`);
    
    try {
      // 1. D'abord supprimer les données de questionnaire médical 
      await supabase.from("questionnaire_medical").delete().eq("user_id", userId);
      console.log("Données de questionnaire médical supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression de questionnaire_medical:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 2. Supprimer les réponses au questionnaire
      await supabase.from("questionnaire_preferences_responses").delete().eq("user_id", userId);
      await supabase.from("questionnaire_responses").delete().eq("user_id", userId);
      console.log("Réponses au questionnaire supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des réponses au questionnaire:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 3. Supprimer les synthèses de questionnaire
      await supabase.from("questionnaire_synthesis").delete().eq("user_id", userId);
      console.log("Synthèses de questionnaire supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des synthèses:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 4. Supprimer les signatures
      await supabase.from("user_signatures").delete().eq("user_id", userId);
      console.log("Signatures supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des signatures:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 5. Supprimer les personnes de confiance
      await supabase.from("trusted_persons").delete().eq("user_id", userId);
      console.log("Personnes de confiance supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des personnes de confiance:", err);
      // Continuer même en cas d'erreur
    }

    try {
      // 6. Suppression des documents PDF
      await supabase.from("pdf_documents").delete().eq("user_id", userId);
      console.log("Documents PDF supprimés");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des documents PDF:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 7. Suppression des documents médicaux
      await supabase.from("medical_documents").delete().eq("user_id", userId);
      console.log("Documents médicaux supprimés");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des documents médicaux:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 8. Suppression des données médicales
      await supabase.from("medical_data").delete().eq("user_id", userId);
      console.log("Données médicales supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des données médicales:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 9. Supprimer les logs d'accès associés à l'utilisateur
      await supabase.from("document_access_logs").delete().eq("user_id", userId);
      console.log("Logs d'accès supprimés");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des logs d'accès:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 10. Supprimer les codes d'accès aux documents
      await supabase.from("document_access_codes").delete().eq("user_id", userId);
      console.log("Codes d'accès aux documents supprimés");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des codes d'accès:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 11. Suppression des directives
      await supabase.from("directives").delete().eq("user_id", userId);
      console.log("Directives supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des directives:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 12. Suppression des directives avancées
      await supabase.from("advance_directives").delete().eq("user_id", userId);
      console.log("Directives avancées supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des directives avancées:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 13. Suppression des commandes
      await supabase.from("orders").delete().eq("user_id", userId);
      console.log("Commandes supprimées");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des commandes:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 14. Suppression des avis
      await supabase.from("reviews").delete().eq("user_id", userId);
      console.log("Avis supprimés");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression des avis:", err);
      // Continuer même en cas d'erreur
    }
    
    try {
      // 15. Suppression des informations de profil
      await supabase.from("profiles").delete().eq("id", userId);
      console.log("Profil supprimé");
    } catch (err) {
      console.log("Erreur ou table inexistante lors de la suppression du profil:", err);
      // Continuer même en cas d'erreur
    }
    
    // 16. Enfin, supprimer le compte utilisateur lui-même
    console.log("Tentative de suppression du compte utilisateur");
    const { error: deleteError } = await adminAuthClient.deleteUser(userId);

    if (deleteError) {
      console.error("Erreur lors de la suppression du compte:", deleteError);
      throw deleteError;
    }

    console.log("Compte utilisateur supprimé avec succès");
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

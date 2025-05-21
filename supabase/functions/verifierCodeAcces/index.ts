
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
    const documentId = data.document_id;
    
    // Récupérer les données du profil pour vérifier plus tard
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Vérifier si le dossier médical existe pour ce document_id spécifique
    const { data: medicalRecordData } = await supabase
      .from("dossiers_medicaux")
      .select("contenu_dossier, id")
      .eq("id", documentId)
      .maybeSingle();

    // Si le dossier n'existe pas pour ce document_id, créez-en un nouveau
    let dossierContent = null;
    let dossierId = documentId;
    
    if (!medicalRecordData) {
      // Récupérer les directives pour cet utilisateur, à inclure dans le dossier médical
      const { data: directivesData } = await supabase
        .from("advance_directives")
        .select("content")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1);
      
      // Créer un nouveau dossier médical avec les directives
      const dossierContenu = {
        patient: {
          nom: profileData?.last_name,
          prenom: profileData?.first_name,
          date_naissance: profileData?.birth_date
        }
      };
      
      // Ajouter les directives si disponibles
      if (directivesData && directivesData.length > 0) {
        dossierContenu["directives_anticipees"] = directivesData[0].content;
      }
      
      // Insérer le nouveau dossier
      const { data: newDossier } = await supabase
        .from("dossiers_medicaux")
        .insert({
          id: documentId,
          code_acces: code_saisi,
          contenu_dossier: dossierContenu
        })
        .select()
        .single();
      
      dossierContent = dossierContenu;
      
      console.log("Nouveau dossier médical créé avec ID:", documentId);
    } else {
      dossierContent = medicalRecordData.contenu_dossier;
      dossierId = medicalRecordData.id;
      console.log("Dossier médical existant récupéré, ID:", dossierId);
    }

    // Assurer l'enregistrement de cet accès
    await logAccess(userId, true, `Accès valide au dossier ${dossierId}`);

    // Retourner les informations du dossier
    return new Response(
      JSON.stringify({
        success: true,
        dossier: {
          id: dossierId,
          userId: userId,
          isFullAccess: data.is_full_access,
          profileData: profileData,
          contenu: dossierContent
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

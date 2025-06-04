
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmEmailRequest {
  email: string;
  confirmationCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Début de la confirmation d'email");
    
    const { email, confirmationCode }: ConfirmEmailRequest = await req.json();
    
    console.log("Paramètres reçus:", { 
      email: email.substring(0, 3) + "****",
      codeLength: confirmationCode?.length
    });

    if (!email || !confirmationCode) {
      console.error("❌ Paramètres manquants");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email et code requis" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Créer un client Supabase avec les permissions service_role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Configuration Supabase manquante");
      throw new Error("Configuration Supabase manquante");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log("✅ Client Supabase admin créé");

    // Récupérer l'utilisateur par email
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      console.error("❌ Erreur récupération utilisateurs:", fetchError);
      throw fetchError;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error("❌ Utilisateur non trouvé");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Utilisateur non trouvé" 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Vérifier le code de confirmation dans les métadonnées de l'utilisateur
    const storedCode = user.user_metadata?.confirmation_code;
    
    if (!storedCode || storedCode !== confirmationCode) {
      console.error("❌ Code de confirmation invalide");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Code de confirmation invalide" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("✅ Code de confirmation valide");

    // Confirmer l'email de l'utilisateur
    const { data: confirmData, error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          confirmation_code: null // Supprimer le code après utilisation
        }
      }
    );

    if (confirmError) {
      console.error("❌ Erreur confirmation email:", confirmError);
      throw confirmError;
    }

    console.log("✅ Email confirmé avec succès pour l'utilisateur:", user.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email confirmé avec succès",
        userId: user.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Erreur lors de la confirmation d'email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de la confirmation d'email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

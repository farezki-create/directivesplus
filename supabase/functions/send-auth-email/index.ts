
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'signup' | 'recovery';
  confirmation_url?: string;
  recovery_url?: string;
  user_data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, confirmation_url, recovery_url, user_data }: AuthEmailRequest = await req.json();

    console.log("📧 Envoi email via API Brevo");
    console.log("Type:", type);
    console.log("Email:", email);

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY manquant dans les secrets Supabase");
    }

    let subject = "";
    let htmlContent = "";

    if (type === 'signup') {
      subject = "Confirmez votre inscription - DirectivesPlus";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Bienvenue sur DirectivesPlus !</h1>
          <p>Merci de vous être inscrit sur notre plateforme.</p>
          <p>Pour confirmer votre compte, cliquez sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmation_url}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirmer mon inscription
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${confirmation_url}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Cet email a été envoyé par DirectivesPlus. Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
          </p>
        </div>
      `;
    } else if (type === 'recovery') {
      subject = "Réinitialisation de votre mot de passe - DirectivesPlus";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Réinitialisation de mot de passe</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recovery_url}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${recovery_url}</p>
          <p><strong>Ce lien expire dans 1 heure.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
          </p>
        </div>
      `;
    }

    const emailData = {
      sender: {
        name: "DirectivesPlus",
        email: "contact@directivesplus.fr"
      },
      to: [{
        email: email,
        name: user_data?.first_name || "Utilisateur"
      }],
      subject: subject,
      htmlContent: htmlContent
    };

    console.log("Envoi via API REST Brevo...");
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    console.log("Réponse Brevo:", {
      status: response.status,
      statusText: response.statusText,
      result
    });

    if (!response.ok) {
      throw new Error(`Erreur API Brevo: ${response.status} - ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Email envoyé avec succès via Brevo",
      brevo_response: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Erreur envoi email:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

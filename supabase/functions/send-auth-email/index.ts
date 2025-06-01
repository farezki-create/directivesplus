
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  type: 'confirmation' | 'recovery' | 'invite';
  token?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY not configured" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const { to, subject, htmlContent, textContent, type, token }: EmailRequest = await req.json();

    console.log(`📧 Envoi email ${type} vers:`, to);

    // Préparer le contenu selon le type
    let finalHtmlContent = htmlContent;
    let finalSubject = subject;

    if (type === 'confirmation' && token) {
      const confirmUrl = `${req.headers.get('origin')}/auth/confirm?token=${token}&type=signup`;
      finalHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Confirmez votre inscription - DirectivesPlus</h1>
          <p>Bonjour,</p>
          <p>Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirmer mon compte
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #6b7280;">${confirmUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
          </p>
        </div>
      `;
      finalSubject = "Confirmez votre inscription - DirectivesPlus";
    }

    // Envoyer via l'API Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "DirectivesPlus",
          email: "fann.innovation@gmail.com"
        },
        to: [{
          email: to,
          name: to.split('@')[0]
        }],
        subject: finalSubject,
        htmlContent: finalHtmlContent,
        textContent: textContent || finalHtmlContent.replace(/<[^>]*>/g, ''),
        tags: [`auth-${type}`]
      })
    });

    const brevoResult = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error("❌ Erreur Brevo:", brevoResult);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi de l'email",
          details: brevoResult 
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("✅ Email envoyé avec succès:", brevoResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: brevoResult.messageId 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error("💥 Erreur dans send-auth-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);

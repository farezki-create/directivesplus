
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

    const { to, subject, type, token }: EmailRequest = await req.json();

    console.log(`📧 Envoi email ${type} vers:`, to);

    // Préparer le contenu selon le type
    let finalHtmlContent = '';
    let finalSubject = subject || 'Email de DirectivesPlus';

    if (type === 'confirmation' && token) {
      const confirmUrl = `${req.headers.get('origin')}/auth/confirm?token=${token}&type=signup`;
      finalHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">DirectivesPlus</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0;">Plateforme de directives anticipées</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Confirmez votre inscription</h2>
            <p style="color: #4b5563; margin-bottom: 20px;">Bonjour,</p>
            <p style="color: #4b5563; margin-bottom: 30px;">
              Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte et accéder à votre espace personnel, 
              veuillez cliquer sur le bouton ci-dessous :
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                ✅ Confirmer mon compte
              </a>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 30px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              </p>
              <p style="word-break: break-all; color: #2563eb; margin: 10px 0 0 0; font-size: 14px;">${confirmUrl}</p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                © 2024 DirectivesPlus - Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      `;
      finalSubject = "Confirmez votre inscription - DirectivesPlus";
    } else {
      // Contenu par défaut si pas de type spécifique
      finalHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">DirectivesPlus</h1>
          <p>Un email vous a été envoyé depuis DirectivesPlus.</p>
          <p>Si vous avez des questions, contactez notre support.</p>
        </div>
      `;
    }

    // Vérifier que le contenu HTML n'est pas vide
    if (!finalHtmlContent || finalHtmlContent.trim().length === 0) {
      console.error("❌ htmlContent est vide");
      return new Response(
        JSON.stringify({ error: "Contenu HTML manquant" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("📝 Contenu HTML généré, longueur:", finalHtmlContent.length);

    // Envoyer via l'API Brevo avec la nouvelle adresse expéditrice
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
          email: "contact@directivesplus.fr"
        },
        to: [{
          email: to,
          name: to.split('@')[0]
        }],
        subject: finalSubject,
        htmlContent: finalHtmlContent,
        textContent: finalHtmlContent.replace(/<[^>]*>/g, ''),
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

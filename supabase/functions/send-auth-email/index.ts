
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
  console.log("🚀 Edge function send-auth-email STARTED");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("⚡ OPTIONS request handled");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📥 Processing POST request...");
    
    // Récupérer les paramètres SMTP depuis les secrets
    console.log("🔍 Checking SMTP environment variables...");
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp-relay.brevo.com";
    const smtpPort = Deno.env.get("SMTP_PORT") || "587";
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    
    console.log("🔧 SMTP Config:", {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? `${smtpUser.substring(0, 5)}...` : "MISSING",
      password: smtpPassword ? "PROVIDED" : "MISSING"
    });
    
    if (!smtpUser || !smtpPassword) {
      console.error("❌ Paramètres SMTP manquants");
      return new Response(
        JSON.stringify({ error: "Configuration SMTP incomplète" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("📖 Parsing request body...");
    const requestBody = await req.json();
    console.log("📄 Request data:", {
      to: requestBody.to,
      type: requestBody.type,
      hasToken: !!requestBody.token
    });

    const { to, subject, type, token }: EmailRequest = requestBody;

    console.log(`📧 Preparing ${type} email for: ${to}`);
    console.log(`🔑 Token provided: ${token ? 'YES' : 'NO'}`);

    // Préparer le contenu selon le type
    let finalHtmlContent = '';
    let finalSubject = subject || 'Email de DirectivesPlus';

    if (type === 'confirmation' && token) {
      const confirmUrl = `${req.headers.get('origin')}/auth/confirm?token=${token}&type=signup`;
      console.log(`🔗 Confirmation URL generated: ${confirmUrl}`);
      
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
      console.log("📝 Using default email content");
      finalHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">DirectivesPlus</h1>
          <p>Un email vous a été envoyé depuis DirectivesPlus.</p>
          <p>Si vous avez des questions, contactez notre support.</p>
        </div>
      `;
    }

    console.log("📝 HTML content generated, length:", finalHtmlContent.length);

    // Préparer l'email pour l'API Brevo
    const emailData = {
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
    };

    console.log("📤 Sending email via Brevo API...");
    console.log("🎯 Email payload:", {
      sender: emailData.sender,
      to: emailData.to,
      subject: emailData.subject,
      tags: emailData.tags
    });

    // Envoyer via l'API Brevo v3/smtp/email
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": smtpPassword,
        "content-type": "application/json"
      },
      body: JSON.stringify(emailData)
    });

    console.log("📡 Brevo API response status:", brevoResponse.status);
    const brevoResult = await brevoResponse.json();
    console.log("📨 Brevo API response:", brevoResult);

    if (!brevoResponse.ok) {
      console.error("❌ Erreur SMTP Brevo:", brevoResult);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi de l'email SMTP",
          details: brevoResult,
          status: brevoResponse.status
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    console.log("✅ Email SMTP envoyé avec succès:", brevoResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: brevoResult.messageId,
        method: 'brevo_api'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error("💥 Erreur dans send-auth-email:", error);
    console.error("💥 Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);

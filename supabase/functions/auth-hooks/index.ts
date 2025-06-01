
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthHookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

interface EmailRequest {
  recipient_email: string;
  template_type: 'confirmation' | 'recovery' | 'magic_link';
  user_data?: any;
  confirmation_url?: string;
  recovery_url?: string;
  magic_link_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AuthHookPayload = await req.json();
    console.log("🎣 Auth Hook reçu:", payload);

    // Vérifier que c'est un événement d'auth pertinent
    if (payload.table !== 'users' || !payload.record) {
      console.log("Événement ignoré - pas un utilisateur");
      return new Response(JSON.stringify({ success: true, message: "Event ignored" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const user = payload.record;
    console.log("Utilisateur:", {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      recovery_sent_at: user.recovery_sent_at
    });

    // Détecter le type d'email à envoyer
    let emailType: 'confirmation' | 'recovery' | 'magic_link' = 'confirmation';
    let actionUrl = '';

    if (payload.type === 'INSERT' && !user.email_confirmed_at) {
      // Nouvel utilisateur - email de confirmation
      emailType = 'confirmation';
      actionUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth/confirm?token=${user.confirmation_token || 'TOKEN_PLACEHOLDER'}`;
    } else if (user.recovery_sent_at && new Date(user.recovery_sent_at) > new Date(Date.now() - 60000)) {
      // Reset password récent - email de récupération
      emailType = 'recovery';
      actionUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth/reset-password?token=${user.recovery_token || 'TOKEN_PLACEHOLDER'}`;
    } else {
      console.log("Aucun email à envoyer pour cet événement");
      return new Response(JSON.stringify({ success: true, message: "No email needed" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Préparer les données email
    const emailData = await prepareEmailData(user.email, emailType, actionUrl, user);

    // Envoyer via notre Edge Function de test SMTP qui fonctionne
    const emailResponse = await sendEmailViaBreviFunction(emailData);

    console.log("✅ Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: `Email ${emailType} envoyé via Brevo`,
      email_response: emailResponse
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Erreur Auth Hook:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

async function prepareEmailData(email: string, type: 'confirmation' | 'recovery' | 'magic_link', actionUrl: string, userData: any) {
  const templates = {
    confirmation: {
      subject: "Confirmez votre inscription - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Bienvenue sur DirectivesPlus !</h1>
          <p>Bonjour,</p>
          <p>Merci de vous être inscrit sur DirectivesPlus. Pour finaliser votre inscription et sécuriser votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Confirmer mon email
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p>Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    },
    recovery: {
      subject: "Réinitialisation de votre mot de passe - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Réinitialisation de mot de passe</h1>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur DirectivesPlus. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p><strong>Important :</strong> Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    },
    magic_link: {
      subject: "Connexion magique - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Connexion magique</h1>
          <p>Bonjour,</p>
          <p>Cliquez sur le bouton ci-dessous pour vous connecter automatiquement à DirectivesPlus :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Se connecter maintenant
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p><strong>Important :</strong> Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    }
  };

  return {
    recipient_email: email,
    subject: templates[type].subject,
    html: templates[type].html,
    type: type
  };
}

async function sendEmailViaBreviFunction(emailData: any) {
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  const smtpSenderEmail = Deno.env.get("SMTP_SENDER_EMAIL") || "contact@directivesplus.fr";
  const smtpSenderName = Deno.env.get("SMTP_SENDER_NAME") || "DirectivesPlus";
  
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY manquant");
  }

  const brevoPayload = {
    sender: {
      name: smtpSenderName,
      email: smtpSenderEmail
    },
    to: [{
      email: emailData.recipient_email,
      name: "Utilisateur DirectivesPlus"
    }],
    subject: emailData.subject,
    htmlContent: emailData.html
  };

  console.log("Envoi via API REST Brevo...");
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey
    },
    body: JSON.stringify(brevoPayload)
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

  return result;
}

serve(handler);

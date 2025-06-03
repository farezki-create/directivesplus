
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  type: 'confirmation' | 'reset' | 'welcome';
  token?: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📧 Début de l'envoi d'email via Resend");
    
    const { email, type, token, firstName, lastName }: EmailRequest = await req.json();
    
    console.log("Paramètres reçus:", { 
      email: email.substring(0, 3) + "****",
      type, 
      hasToken: !!token,
      hasName: !!(firstName && lastName)
    });

    // Vérifier la configuration Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY non configuré");
      throw new Error("RESEND_API_KEY non configuré");
    }

    console.log("✅ Configuration Resend trouvée");

    let subject: string;
    let html: string;
    const baseUrl = req.headers.get('origin') || 'https://www.directivesplus.fr';

    if (type === 'confirmation') {
      // Email de confirmation d'inscription
      subject = "Confirmez votre inscription - DirectivesPlus";
      html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">DirectivesPlus</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Vos directives anticipées sécurisées</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">
              Bienvenue${firstName ? ` ${firstName}` : ''} ! 👋
            </h2>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
              Merci de vous être inscrit(e) sur <strong>DirectivesPlus</strong>. Votre compte a été créé avec succès !
            </p>

            <div style="background: #f1f5f9; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 18px;">✅ Votre inscription est confirmée</h3>
              <p style="color: #475569; margin: 0; line-height: 1.5;">
                Vous pouvez maintenant accéder à votre espace personnel pour créer et gérer vos directives anticipées en toute sécurité.
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${baseUrl}/auth" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: 600;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                🔐 Accéder à mon espace
              </a>
            </div>

            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">💡 Prochaines étapes</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Connectez-vous à votre espace personnel</li>
                <li>Complétez vos informations de profil</li>
                <li>Rédigez vos directives anticipées</li>
                <li>Définissez votre personne de confiance</li>
              </ul>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; line-height: 1.5;">
              Si vous avez des questions, notre équipe est là pour vous aider. 
              N'hésitez pas à nous contacter à <a href="mailto:support@directivesplus.fr" style="color: #667eea;">support@directivesplus.fr</a>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.4;">
              DirectivesPlus - Plateforme sécurisée de directives anticipées<br>
              Conforme RGPD • Hébergement sécurisé en France 🇫🇷<br>
              <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">www.directivesplus.fr</a>
            </p>
          </div>
        </div>
      `;
    } else if (type === 'reset') {
      // Email de réinitialisation de mot de passe
      const resetUrl = `${baseUrl}/auth?reset=${token}`;
      subject = "Réinitialisation de votre mot de passe - DirectivesPlus";
      html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DirectivesPlus</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">
              Réinitialisation demandée
            </h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        </div>
      `;
    } else {
      // Email de bienvenue simple
      subject = "Bienvenue sur DirectivesPlus !";
      html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DirectivesPlus</h1>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">
              Bienvenue${firstName ? ` ${firstName}` : ''} !
            </h2>
            
            <p style="color: #666; line-height: 1.6;">
              Votre inscription sur DirectivesPlus a été confirmée. Vous pouvez maintenant accéder à votre espace personnel sécurisé.
            </p>
          </div>
        </div>
      `;
    }

    console.log("📤 Envoi de l'email via Resend...");

    const emailResponse = await resend.emails.send({
      from: "DirectivesPlus <noreply@directivesplus.fr>",
      to: [email],
      subject,
      html,
    });

    console.log("✅ Email envoyé avec succès:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        message: "Email envoyé avec succès"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi d'email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de l'envoi d'email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

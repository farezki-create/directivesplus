
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  code: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📧 Début de l'envoi de code OTP via Resend");
    
    const { email, code, firstName, lastName }: OTPEmailRequest = await req.json();
    
    console.log("Paramètres reçus:", { 
      email: email.substring(0, 3) + "****",
      codeLength: code?.length,
      hasName: !!(firstName && lastName)
    });

    if (!email || !code) {
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

    // Vérifier la configuration Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("❌ RESEND_API_KEY non configuré");
      throw new Error("RESEND_API_KEY non configuré");
    }

    console.log("✅ Configuration Resend trouvée");

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8fafc;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">DirectivesPlus</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Code de vérification</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">
            Bonjour${firstName ? ` ${firstName}` : ''} ! 👋
          </h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
            Voici votre code de vérification pour accéder à <strong>DirectivesPlus</strong> :
          </p>

          <!-- Code OTP -->
          <div style="background: #f1f5f9; border: 2px solid #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Code de vérification</h3>
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #64748b; margin: 15px 0 0 0; font-size: 14px;">
              ⏰ Ce code expire dans 10 minutes
            </p>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">🔒 Sécurité</h4>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6; font-size: 14px;">
              <li>Ne partagez jamais ce code avec qui que ce soit</li>
              <li>Notre équipe ne vous demandera jamais ce code</li>
              <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
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
            <a href="https://www.directivesplus.fr" style="color: #667eea; text-decoration: none;">www.directivesplus.fr</a>
          </p>
        </div>
      </div>
    `;

    console.log("📤 Envoi du code OTP via Resend...");

    const emailResponse = await resend.emails.send({
      from: "DirectivesPlus <noreply@directivesplus.fr>",
      to: [email],
      subject: `Votre code de vérification : ${code}`,
      html,
    });

    console.log("✅ Code OTP envoyé avec succès:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        message: "Code OTP envoyé avec succès"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi du code OTP:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de l'envoi du code OTP"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

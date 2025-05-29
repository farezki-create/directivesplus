
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPEmailRequest {
  email: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Send OTP Email function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      console.error('❌ SENDGRID_API_KEY not configured');
      throw new Error('SendGrid API key not configured');
    }

    const { email, token }: SendOTPEmailRequest = await req.json();
    console.log('📧 Sending OTP email to:', email);

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Préparer l'email avec le template HTML
    const emailData = {
      personalizations: [
        {
          to: [{ email: email }],
          subject: 'Votre code de vérification DirectivesPlus'
        }
      ],
      from: {
        email: 'mesdirectives@directivesplus.fr',
        name: 'DirectivesPlus'
      },
      content: [
        {
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Code de vérification DirectivesPlus</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1e40af; margin: 0; font-size: 28px;">DirectivesPlus</h1>
                  <p style="color: #6b7280; margin: 10px 0 0 0;">Vos directives anticipées en toute sécurité</p>
                </div>
                
                <div style="background-color: #f8fafc; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                  <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 24px;">Code de vérification</h2>
                  <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px;">
                    Votre code de vérification est :
                  </p>
                  <div style="background-color: #1e40af; color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Courier New', monospace;">
                    ${token}
                  </div>
                  <p style="color: #ef4444; margin: 20px 0 0 0; font-size: 14px; font-weight: 500;">
                    ⏰ Ce code expire dans 10 minutes
                  </p>
                </div>
                
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">🔒 Conseils de sécurité :</h3>
                  <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                    <li>Ne partagez jamais ce code avec personne</li>
                    <li>DirectivesPlus ne vous demandera jamais ce code par téléphone</li>
                    <li>Si vous n'avez pas demandé ce code, ignorez cet email</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    Cet email a été envoyé par <strong>DirectivesPlus</strong><br>
                    Si vous avez des questions, contactez-nous à mesdirectives@directivesplus.fr
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        }
      ]
    };

    // Envoyer l'email via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SendGrid API error:', response.status, errorText);
      throw new Error(`SendGrid API error: ${response.status} ${errorText}`);
    }

    console.log('✅ Email sent successfully via SendGrid');

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('❌ Error in send-otp-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);

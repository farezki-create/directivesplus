
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'confirmation' | 'password_reset';
  confirmationUrl?: string;
  resetUrl?: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!resendApiKey) {
    return new Response(
      JSON.stringify({ error: 'Clé API Resend manquante' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { to, subject, type, confirmationUrl, resetUrl, userName }: EmailRequest = await req.json();

    // Validation des données
    if (!to || !subject || !type) {
      return new Response(
        JSON.stringify({ error: 'Paramètres requis manquants' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let htmlContent = '';
    let textContent = '';

    if (type === 'confirmation') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmez votre compte DirectivesPlus</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Bienvenue sur DirectivesPlus !</h1>
            <p>Bonjour ${userName || ''},</p>
            <p>Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmer mon compte
              </a>
            </div>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
            <p>Ce lien expirera dans 24 heures.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
            </p>
          </div>
        </body>
        </html>
      `;
      
      textContent = `
        Bienvenue sur DirectivesPlus !
        
        Bonjour ${userName || ''},
        
        Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte, veuillez cliquer sur ce lien :
        
        ${confirmationUrl}
        
        Ce lien expirera dans 24 heures.
        
        Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
      `;
    } else if (type === 'password_reset') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation de mot de passe - DirectivesPlus</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Réinitialisation de mot de passe</h1>
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe DirectivesPlus. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>Ce lien expirera dans 1 heure.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
            </p>
          </div>
        </body>
        </html>
      `;
      
      textContent = `
        Réinitialisation de mot de passe - DirectivesPlus
        
        Bonjour,
        
        Vous avez demandé la réinitialisation de votre mot de passe DirectivesPlus. Cliquez sur ce lien pour créer un nouveau mot de passe :
        
        ${resetUrl}
        
        Ce lien expirera dans 1 heure.
        
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
      `;
    }

    // Appel à l'API Resend avec l'adresse par défaut vérifiée
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DirectivesPlus <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erreur Resend:', responseData);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi de l\'email',
          details: responseData 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Email envoyé avec succès:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.id,
        message: 'Email envoyé avec succès' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
      status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);

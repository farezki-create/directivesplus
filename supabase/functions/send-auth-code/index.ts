
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthCodeRequest {
  target: string;
  channel: 'email' | 'sms';
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📨 Début de l'envoi du code d'authentification");
    
    const { target, channel, userId }: AuthCodeRequest = await req.json();
    
    console.log("Paramètres reçus:", { target: target.substring(0, 5) + "****", channel });

    // Initialiser Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Générer le code via la fonction RPC
    const { data: code, error: codeError } = await supabase.rpc('generate_auth_code', {
      p_target: target,
      p_channel: channel,
      p_user_id: userId || null
    });

    if (codeError) {
      console.error("❌ Erreur génération code:", codeError);
      throw new Error(codeError.message);
    }

    console.log("✅ Code généré:", code);

    // Envoyer le code selon le canal
    if (channel === 'email') {
      await sendEmailCode(target, code);
    } else if (channel === 'sms') {
      await sendSMSCode(target, code);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Code envoyé via ${channel}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi du code:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de l'envoi du code"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendEmailCode(email: string, code: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY non configuré");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "DirectivesPlus <noreply@directivesplus.fr>",
      to: [email],
      subject: "Votre code de connexion - DirectivesPlus",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DirectivesPlus</h1>
          </div>
          
          <div style="padding: 40px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">
              Votre code de connexion
            </h2>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${code}</span>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; text-align: center;">
              Ce code expire dans 10 minutes.
            </p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur Resend: ${error}`);
  }

  console.log("✅ Email envoyé via Resend");
}

async function sendSMSCode(phoneNumber: string, code: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error("Configuration Twilio manquante");
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const message = `DirectivesPlus - Votre code de connexion : ${code}. Ce code expire dans 10 minutes.`;
  
  const formData = new URLSearchParams();
  formData.append('From', twilioPhoneNumber);
  formData.append('To', phoneNumber);
  formData.append('Body', message);

  const auth = btoa(`${accountSid}:${authToken}`);

  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur Twilio: ${error.message}`);
  }

  console.log("✅ SMS envoyé via Twilio");
}

serve(handler);

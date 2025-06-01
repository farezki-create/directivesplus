
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMTPTestRequest {
  recipient_email: string;
  test_type: 'nodemailer' | 'fetch';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient_email, test_type = 'fetch' }: SMTPTestRequest = await req.json();

    console.log("🧪 Test SMTP via Edge Function");
    console.log("Test type:", test_type);
    console.log("Recipient:", recipient_email);

    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpSenderEmail = Deno.env.get("SMTP_SENDER_EMAIL");
    const smtpSenderName = Deno.env.get("SMTP_SENDER_NAME");

    console.log("SMTP Config:", {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      senderEmail: smtpSenderEmail,
      senderName: smtpSenderName,
      passwordConfigured: !!smtpPassword
    });

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpSenderEmail) {
      throw new Error("Configuration SMTP incomplète dans les secrets Supabase");
    }

    if (test_type === 'fetch') {
      // Test via l'API REST de Brevo
      const brevoApiKey = Deno.env.get("BREVO_API_KEY");
      
      if (!brevoApiKey) {
        throw new Error("BREVO_API_KEY manquant");
      }

      const emailData = {
        sender: {
          name: smtpSenderName,
          email: smtpSenderEmail
        },
        to: [{
          email: recipient_email,
          name: "Test Recipient"
        }],
        subject: "Test SMTP via Edge Function",
        htmlContent: `
          <h1>Test SMTP réussi !</h1>
          <p>Cet email a été envoyé via l'Edge Function Supabase utilisant l'API REST de Brevo.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `
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
        method: "API REST Brevo",
        result,
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } else {
      // Test SMTP direct (simulation car Deno n'a pas nodemailer natif)
      console.log("Test SMTP direct simulé...");
      
      return new Response(JSON.stringify({
        success: true,
        method: "SMTP Direct (simulé)",
        message: "Test SMTP direct non disponible dans Deno, utilisez l'API REST",
        config: {
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          recipient: recipient_email
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("❌ Erreur test SMTP:", error);
    
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

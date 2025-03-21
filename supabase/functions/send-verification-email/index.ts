
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Fonction send-verification-email appelée");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, confirmationUrl }: EmailRequest = await req.json();
    console.log("Envoi d'email à:", to);
    console.log("URL de confirmation:", confirmationUrl);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DirectivesPlus <verification@directivesplus.fr>",
        to: [to],
        subject: "Vérification de votre compte DirectivesPlus",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #0f172a;">Bienvenue sur DirectivesPlus</h1>
            <p>Merci de vous être inscrit sur DirectivesPlus. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Confirmer mon email
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px;">Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Erreur Resend:", error);
      throw new Error(`Erreur lors de l'envoi de l'email: ${error}`);
    }

    const data = await res.json();
    console.log("Email envoyé avec succès:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur dans la fonction send-verification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

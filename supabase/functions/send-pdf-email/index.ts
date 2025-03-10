
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

interface EmailRequest {
  pdfUrl: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfUrl, recipientEmail }: EmailRequest = await req.json();
    console.log("Sending email to:", recipientEmail);

    if (!pdfUrl || !recipientEmail) {
      throw new Error("Missing required parameters: pdfUrl or recipientEmail");
    }

    // Extract base64 content from data URL
    const base64Data = pdfUrl.split(',')[1];
    if (!base64Data) {
      throw new Error("Invalid PDF data format");
    }

    const emailResponse = await resend.emails.send({
      from: "DirectivesPlus <notification@directivesplus.fr>",
      to: [recipientEmail],
      subject: "Vos directives anticipées",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f172a; margin-bottom: 20px;">Vos directives anticipées</h1>
          <p>Bonjour,</p>
          <p>Vous trouverez en pièce jointe vos directives anticipées au format PDF.</p>
          <p>Ce document est personnel et confidentiel. Nous vous recommandons de le partager avec votre personne de confiance et votre médecin traitant.</p>
          <p>Merci d'utiliser DirectivesPlus pour préserver vos souhaits concernant vos soins de fin de vie.</p>
          <p style="margin-top: 30px;">Cordialement,</p>
          <p style="margin: 0;">L'équipe DirectivesPlus</p>
        </div>
      `,
      attachments: [
        {
          filename: "directives-anticipees.pdf",
          content: base64Data,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

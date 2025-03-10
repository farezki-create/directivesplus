
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

    // Verify PDF data format
    let base64Data: string;
    
    if (pdfUrl.startsWith('data:application/pdf;base64,')) {
      // Extract base64 content from data URL
      base64Data = pdfUrl.split(',')[1];
      console.log("Base64 data extracted from data URL, length:", base64Data?.length || 0);
    } else {
      // Try to use raw base64 string
      base64Data = pdfUrl;
      console.log("Using raw base64 string, length:", base64Data?.length || 0);
    }

    if (!base64Data) {
      console.error("No base64 data found");
      throw new Error("Invalid PDF data format - no base64 content found");
    }

    // Validate the base64 string
    try {
      // Simple validation for base64 format
      if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
        throw new Error("Invalid base64 format");
      }
    } catch (error) {
      console.error("Base64 validation error:", error);
      throw new Error("Invalid PDF data format - not valid base64");
    }

    console.log("Base64 data valid, sending email with attachment");

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

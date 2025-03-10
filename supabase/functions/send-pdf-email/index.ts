

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

    // Normalize the input - sometimes we get double prefixes due to client-side transformations
    let normalizedPdfUrl = pdfUrl;
    if (pdfUrl.includes("data:application/pdf;base64,data:application/pdf;base64,")) {
      normalizedPdfUrl = pdfUrl.replace("data:application/pdf;base64,data:application/pdf;base64,", "data:application/pdf;base64,");
      console.log("Fixed double prefix in PDF URL");
    }
    
    if (pdfUrl.includes("data:application/pdf;filename=")) {
      // Handle filename format - extract the base64 data
      const parts = normalizedPdfUrl.split(';base64,');
      if (parts.length > 1) {
        normalizedPdfUrl = "data:application/pdf;base64," + parts[parts.length - 1];
        console.log("Extracted base64 data from filename format");
      }
    }

    // Extract base64 content
    let base64Data: string;
    
    if (normalizedPdfUrl.startsWith('data:application/pdf;base64,')) {
      base64Data = normalizedPdfUrl.split(',')[1];
      console.log("Base64 data extracted from data URL, length:", base64Data?.length || 0);
    } else {
      base64Data = normalizedPdfUrl;
      console.log("Using raw base64 string, length:", base64Data?.length || 0);
    }

    if (!base64Data) {
      console.error("No base64 data found");
      throw new Error("Invalid PDF data format - no base64 content found");
    }

    // Validate the base64 string - more lenient validation to handle possible whitespace
    try {
      base64Data = base64Data.trim();
      // Check if string roughly looks like base64 (allow for some wiggle room)
      if (!/^[A-Za-z0-9+/=\s]+$/.test(base64Data)) {
        console.error("Base64 validation failed, first 50 chars:", base64Data.substring(0, 50));
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


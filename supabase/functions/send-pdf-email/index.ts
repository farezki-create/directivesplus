
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  pdfUrl: string;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfUrl, recipientEmail }: EmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Directives Anticipées <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "Vos directives anticipées",
      html: `
        <h1>Vos directives anticipées</h1>
        <p>Vous trouverez en pièce jointe vos directives anticipées au format PDF.</p>
        <p>Ce document est personnel et confidentiel.</p>
      `,
      attachments: [
        {
          filename: "directives-anticipees.pdf",
          content: pdfUrl.split(",")[1],
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
  } catch (error) {
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

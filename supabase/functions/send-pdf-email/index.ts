
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Initialize Resend with API key validation
let resend;
try {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables");
    throw new Error("RESEND_API_KEY is not configured properly");
  }
  resend = new Resend(RESEND_API_KEY);
} catch (error) {
  console.error("Error initializing Resend client:", error);
}

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
    if (!RESEND_API_KEY || RESEND_API_KEY === "undefined") {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "RESEND_API_KEY is not configured properly" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { pdfUrl, recipientEmail }: EmailRequest = await req.json();
    console.log("Sending email to:", recipientEmail);
    console.log("PDF URL length:", pdfUrl?.length || 0);
    
    if (!pdfUrl || !recipientEmail) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters: pdfUrl or recipientEmail" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid email format" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Normalize the input - clean up any formatting issues
    let base64Data: string;
    
    if (pdfUrl.startsWith('data:application/pdf;base64,')) {
      base64Data = pdfUrl.substring('data:application/pdf;base64,'.length);
      console.log("Extracted base64 data from standard data URL format");
    } else if (pdfUrl.includes('data:application/pdf;filename=')) {
      // Handle filename format - extract the base64 data
      const parts = pdfUrl.split(';base64,');
      if (parts.length > 1) {
        base64Data = parts[parts.length - 1];
        console.log("Extracted base64 data from filename format");
      } else {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Unable to extract base64 content from PDF URL with filename" 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else {
      // Assume it's already a base64 string
      base64Data = pdfUrl;
      console.log("Using raw base64 string");
    }

    // Remove any whitespace from the base64 string
    base64Data = base64Data.replace(/\s/g, '');
    console.log("Base64 data length after cleaning:", base64Data.length);

    if (base64Data.length < 100) {
      console.error("Base64 data too short to be a valid PDF:", base64Data.length);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid PDF data - too short to be a valid document" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending email via Resend API...");
    
    try {
      const emailResponse = await resend.emails.send({
        from: "DirectivesPlus <onboarding@resend.dev>",
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

      console.log("Email API response:", JSON.stringify(emailResponse));

      if (emailResponse.error) {
        console.error("Resend API error details:", emailResponse.error);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: `Resend API error: ${JSON.stringify(emailResponse.error)}` 
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Email sent successfully",
        id: emailResponse.id 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (resendError: any) {
      console.error("Resend API error details:", resendError);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Email service error: ${resendError.message || "Unknown error"}`,
          details: resendError.error ? JSON.stringify(resendError.error) : undefined
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

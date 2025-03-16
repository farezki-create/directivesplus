
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
  
  // Log a masked version of the key for debugging
  console.log(`API Key configured: ${RESEND_API_KEY.substring(0, 3)}...${RESEND_API_KEY.substring(RESEND_API_KEY.length - 3)}`);
  
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
      console.error("Missing or invalid RESEND_API_KEY");
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
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Request body parsed successfully");
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request format - could not parse JSON body" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { pdfUrl, recipientEmail }: EmailRequest = body;
    
    console.log("Sending email to:", recipientEmail);
    console.log("PDF URL provided:", pdfUrl ? "Yes (length: " + pdfUrl.length + ")" : "No");
    
    if (!pdfUrl || !recipientEmail) {
      console.error("Missing required parameters");
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
      console.error("Invalid email format:", recipientEmail);
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

    // Extract the base64 data from the PDF URL
    let base64Data = "";
    
    if (pdfUrl.startsWith('data:application/pdf;base64,')) {
      base64Data = pdfUrl.substring('data:application/pdf;base64,'.length);
      console.log("Base64 data extracted from data URL");
    } else {
      // Try to be lenient and assume it's already a base64 string
      base64Data = pdfUrl;
      console.log("Using raw string as base64 data");
    }

    // Remove any whitespace from the base64 string
    base64Data = base64Data.replace(/\s/g, '');
    
    console.log("Base64 data length after cleaning:", base64Data.length);
    
    if (base64Data.length < 100) {
      console.error("Invalid PDF data - too short");
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

    // Validate base64 data format
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(base64Data)) {
      console.error("Invalid base64 format - contains non-base64 characters");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid PDF data format - contains non-base64 characters" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    try {
      console.log("Attempting to send email via Resend API...");
      console.log("From: DirectivesPlus <onboarding@resend.dev>");
      console.log("To:", recipientEmail);
      
      if (!resend) {
        console.error("Resend client is not initialized");
        return new Response(
          JSON.stringify({ 
            success: false,
            error: "Email service not initialized properly" 
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
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

      if (!emailResponse || emailResponse.error) {
        console.error("Resend API returned an error:", emailResponse?.error || "No response");
        return new Response(
          JSON.stringify({ 
            success: false,
            error: `Email service error: ${emailResponse?.error?.message || "Unknown error"}`,
            details: emailResponse?.error ? JSON.stringify(emailResponse.error) : "No response from email service"
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

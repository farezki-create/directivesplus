
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCorsOptions } from './cors.ts';
import { generateEmailContent } from './emailContent.ts';
import { getSmtpConfig, validateSmtpConfig, createBrevoEmailData, sendEmailViaBrevo } from './brevoService.ts';
import type { EmailRequest } from './types.ts';

const handler = async (req: Request): Promise<Response> => {
  console.log("🚀 Edge function send-auth-email STARTED");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsOptions();
  }

  try {
    console.log("📥 Processing POST request...");
    
    // Get and validate SMTP configuration
    const smtpConfig = getSmtpConfig();
    validateSmtpConfig(smtpConfig);

    console.log("📖 Parsing request body...");
    const requestBody = await req.json();
    console.log("📄 Request data:", {
      to: requestBody.to,
      type: requestBody.type,
      hasToken: !!requestBody.token
    });

    const { to, type, token }: EmailRequest = requestBody;

    console.log(`📧 Preparing ${type} email for: ${to}`);
    console.log(`🔑 Token provided: ${token ? 'YES' : 'NO'}`);

    // Generate email content
    const { htmlContent, subject } = generateEmailContent(
      { to, type, token } as EmailRequest,
      req.headers.get('origin')
    );

    console.log("📝 HTML content generated, length:", htmlContent.length);

    // Create email data for Brevo
    const emailData = createBrevoEmailData(to, subject, htmlContent, type);

    // Send email via Brevo
    const brevoResult = await sendEmailViaBrevo(emailData, smtpConfig.password!);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: brevoResult.messageId,
        method: 'brevo_api'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error: any) {
    console.error("💥 Erreur dans send-auth-email:", error);
    console.error("💥 Error stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
};

serve(handler);

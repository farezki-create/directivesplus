import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  documentId: string;
}

function generateAccessCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    const emailRequest: EmailRequest = await req.json();
    const accessCode = generateAccessCode();
    
    console.log("Creating document access record...");
    
    // Create document access record
    const { data: accessData, error: accessError } = await supabase
      .from("document_access")
      .insert({
        document_id: emailRequest.documentId,
        access_code: accessCode,
        email: emailRequest.to,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        is_active: true
      })
      .select()
      .single();

    if (accessError) {
      console.error("Error creating document access:", accessError);
      throw new Error("Failed to create document access: " + accessError.message);
    }

    if (!accessData) {
      throw new Error("No access data returned after insert");
    }

    console.log("Document access record created successfully:", accessData);

    // Send email via Resend
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    console.log("Sending email via Resend...");
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Using Resend's default testing domain
        to: [emailRequest.to],
        subject: "Accès à vos directives anticipées",
        html: `
          <h1>Accès à vos directives anticipées</h1>
          <p>Voici votre code d'accès pour consulter vos directives anticipées : <strong>${accessCode}</strong></p>
          <p>Ce code est valable pendant 7 jours.</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send email: " + error);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, data: { accessCode, emailData } }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-document-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest } from "./corsHelpers.ts";
import { handleAuthEvent } from "./authEventHandler.ts";

interface AuthHookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const payload: AuthHookPayload = await req.json();
    const result = await handleAuthEvent(payload);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Erreur Auth Hook:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

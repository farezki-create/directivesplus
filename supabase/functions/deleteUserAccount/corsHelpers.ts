
// CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Handle OPTIONS requests for CORS preflight
export function handleOptionsRequest() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Create standard error response with CORS headers
export function createErrorResponse(message: string, status = 400, details?: any) {
  return new Response(
    JSON.stringify({ 
      error: message,
      details: details ? details : undefined,
      success: false,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Create standard success response with CORS headers
export function createSuccessResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify({
      ...data,
      success: true,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

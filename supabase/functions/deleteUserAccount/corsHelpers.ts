
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function handleOptionsRequest(): Response {
  return new Response('ok', { headers: corsHeaders });
}

export function createErrorResponse(message: string, status: number = 500, details?: string): Response {
  console.error(`❌ [ERROR-RESPONSE] ${status}: ${message}`, details ? `Details: ${details}` : '');
  
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      details: details || null,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

export function createSuccessResponse(data: any): Response {
  console.log('✅ [SUCCESS-RESPONSE] Operation completed successfully');
  
  return new Response(
    JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

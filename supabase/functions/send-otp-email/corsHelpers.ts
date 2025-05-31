
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleCorsRequest = (): Response => {
  return new Response(null, { headers: corsHeaders });
};

export const createErrorResponse = (error: string, status: number = 500, debug?: any): Response => {
  return new Response(
    JSON.stringify({ 
      error,
      debug 
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

export const createSuccessResponse = (data: any): Response => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

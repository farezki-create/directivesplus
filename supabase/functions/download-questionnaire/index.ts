import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting download process...');
    
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file from storage
    console.log('Fetching questionnaire file...');
    const { data, error } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .download('questionnaire.xlsx')

    if (error) {
      console.error('Error fetching file:', error);
      return new Response(
        JSON.stringify({ error: 'Le questionnaire n\'est pas disponible.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await data.arrayBuffer()

    console.log('File downloaded successfully, sending response...');
    
    // Return the file
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="questionnaire-directives-anticipees.xlsx"'
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur inattendue est survenue.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
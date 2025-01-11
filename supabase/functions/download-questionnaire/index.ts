import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting download process...');
    
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Checking if file exists...');
    const { data: fileList, error: listError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .list('', {
        limit: 1,
        search: 'questionnaire.xlsx'
      });

    if (listError) {
      console.error('Error listing files:', listError);
      throw new Error('Could not check if file exists');
    }

    if (!fileList || fileList.length === 0) {
      console.error('File not found in bucket');
      return new Response(
        JSON.stringify({ error: 'Le questionnaire n\'est pas disponible.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    console.log('File exists, attempting download...');
    const { data, error: downloadError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .download('questionnaire.xlsx');

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors du téléchargement du questionnaire.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    if (!data) {
      console.error('No data received from download');
      return new Response(
        JSON.stringify({ error: 'Le fichier est vide ou corrompu.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('File downloaded successfully, preparing response...');
    const arrayBuffer = await data.arrayBuffer();
    
    console.log('Sending file response...');
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="questionnaire-directives-anticipees.xlsx"'
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur inattendue est survenue.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
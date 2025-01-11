import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting signed URL generation process...');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Checking if file exists...');
    const { data: fileExists, error: listError } = await supabaseAdmin
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

    if (!fileExists || fileExists.length === 0) {
      console.error('File not found in bucket');
      return new Response(
        JSON.stringify({ error: 'Le questionnaire n\'est pas disponible.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    console.log('File exists, generating signed URL...');
    const { data: signedUrl, error: signedUrlError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .createSignedUrl('questionnaire.xlsx', 60); // URL valide pendant 60 secondes

    if (signedUrlError) {
      console.error('Error generating signed URL:', signedUrlError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération du lien de téléchargement.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    if (!signedUrl || !signedUrl.signedUrl) {
      console.error('No signed URL generated');
      return new Response(
        JSON.stringify({ error: 'Impossible de générer le lien de téléchargement.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Signed URL generated successfully:', signedUrl.signedUrl);
    return new Response(
      JSON.stringify({ url: signedUrl.signedUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

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
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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier si le fichier existe
    const { data: files, error: listError } = await supabaseClient
      .storage
      .from('questionnaires')
      .list('', {
        limit: 1,
        search: 'questionnaire.xlsx'
      })

    if (listError || !files || files.length === 0) {
      console.error('Erreur ou fichier non trouvé:', listError)
      return new Response(
        JSON.stringify({ error: 'Le questionnaire n\'est pas disponible.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Télécharger le fichier
    const { data, error: downloadError } = await supabaseClient
      .storage
      .from('questionnaires')
      .download('questionnaire.xlsx')

    if (downloadError) {
      console.error('Erreur de téléchargement:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors du téléchargement du questionnaire.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await data.arrayBuffer()

    // Retourner le fichier
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="questionnaire-directives-anticipees.xlsx"'
      }
    })

  } catch (error) {
    console.error('Erreur inattendue:', error)
    return new Response(
      JSON.stringify({ error: 'Une erreur inattendue est survenue.' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
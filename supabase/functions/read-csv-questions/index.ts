import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parse } from 'https://deno.land/std@0.181.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting CSV processing...')
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching CSV file from storage...')
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .download('mon_avis.csv')

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw new Error('Could not download CSV file')
    }

    console.log('Parsing CSV file...')
    const text = new TextDecoder().decode(await fileData.arrayBuffer())
    const rows = parse(text, {
      skipFirstRow: true,
      columns: ['question']
    })

    console.log('Parsed rows:', rows)

    // Supprimer les anciennes questions de la catégorie
    const { error: deleteError } = await supabaseAdmin
      .from('questionnaire_questions')
      .delete()
      .eq('category', 'general_opinion')

    if (deleteError) {
      console.error('Error deleting old questions:', deleteError)
      throw deleteError
    }

    // Insérer les nouvelles questions
    const { error: insertError } = await supabaseAdmin
      .from('questionnaire_questions')
      .insert(
        rows.map((row: any) => ({
          category: 'general_opinion',
          question_text: row.question
        }))
      )

    if (insertError) {
      console.error('Error inserting new questions:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, questionsCount: rows.length }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
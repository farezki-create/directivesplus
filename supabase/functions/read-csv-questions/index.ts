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
    
    // First, let's log the CSV content to debug
    console.log('CSV content:', text)
    
    try {
      // Parse CSV with specific configuration
      const rows = parse(text, {
        skipFirstRow: true,
        columns: ['question', 'indecision', 'plutot_oui', 'plutot_oui_duree_moderee', 
                 'oui_si_equipe_medicale', 'plutot_non_rapidement', 
                 'non_sauf_equipe_medicale', 'plutot_non_non_souffrance']
      })

      console.log('Successfully parsed rows:', rows)

      // Delete existing questions for the category
      const { error: deleteError } = await supabaseAdmin
        .from('questionnaire_questions')
        .delete()
        .eq('category', 'general_opinion')

      if (deleteError) {
        console.error('Error deleting old questions:', deleteError)
        throw deleteError
      }

      // Transform and insert the new questions
      const formattedRows = rows.map((row: any) => ({
        category: 'general_opinion',
        question_text: row.question,
        indecision: row.indecision?.toLowerCase() === 'true' || row.indecision === '1',
        plutot_oui: row.plutot_oui?.toLowerCase() === 'true' || row.plutot_oui === '1',
        plutot_oui_duree_moderee: row.plutot_oui_duree_moderee?.toLowerCase() === 'true' || row.plutot_oui_duree_moderee === '1',
        oui_si_equipe_medicale: row.oui_si_equipe_medicale?.toLowerCase() === 'true' || row.oui_si_equipe_medicale === '1',
        plutot_non_rapidement: row.plutot_non_rapidement?.toLowerCase() === 'true' || row.plutot_non_rapidement === '1',
        non_sauf_equipe_medicale: row.non_sauf_equipe_medicale?.toLowerCase() === 'true' || row.non_sauf_equipe_medicale === '1',
        plutot_non_non_souffrance: row.plutot_non_non_souffrance?.toLowerCase() === 'true' || row.plutot_non_non_souffrance === '1'
      }))

      console.log('Formatted rows for insertion:', formattedRows)

      const { error: insertError } = await supabaseAdmin
        .from('questionnaire_questions')
        .insert(formattedRows)

      if (insertError) {
        console.error('Error inserting new questions:', insertError)
        throw insertError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          questionsCount: formattedRows.length,
          message: 'Questions successfully updated'
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (parseError) {
      console.error('CSV parsing error:', parseError)
      throw new Error(`CSV parsing error: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: 'error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
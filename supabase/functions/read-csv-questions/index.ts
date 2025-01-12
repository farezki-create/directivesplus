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
      // Define header mapping from French to database columns
      const headerMapping = {
        " Question": "question_text",
        "Indécision": "indecision",
        "Plûtot Oui": "plutot_oui",
        "Plûtot Oui, pour une durée modérée, dans un mais thérapeutique, mais la non soufrance est la priorité ": "plutot_oui_duree_moderee",
        "Oui, si l'équipe médicale le juge utile après une procédure collégiale": "oui_si_equipe_medicale",
        "Plûtot Non, rapidement abandonner le thérapeutique au profit de la non souffrance": "plutot_non_rapidement",
        "Non, sauf si l'équipe médicale le juge utile par une procédure collégiale": "non_sauf_equipe_medicale",
        "Plutôt Non, privilégier seulement la non souffrance": "plutot_non_non_souffrance"
      }

      // Parse CSV with the French headers
      const rows = parse(text, {
        skipFirstRow: true,
        columns: Object.keys(headerMapping)
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

      // Transform the data to match database column names
      const formattedRows = rows.map((row: any) => {
        const formattedRow: any = {
          category: 'general_opinion'
        }

        // Map each French header to its corresponding database column
        for (const [frenchHeader, dbColumn] of Object.entries(headerMapping)) {
          const value = row[frenchHeader]
          formattedRow[dbColumn] = value?.toLowerCase() === 'true' || value === '1' || value === 'oui'
          
          // Special handling for question_text
          if (dbColumn === 'question_text') {
            formattedRow[dbColumn] = value
          }
        }

        return formattedRow
      })

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
      return new Response(
        JSON.stringify({ 
          error: parseError.message,
          details: parseError.stack,
          type: 'csv_parse_error'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
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
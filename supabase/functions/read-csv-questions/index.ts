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
      // Parse CSV with the French headers
      const rows = parse(text, {
        skipFirstRow: false,
        separator: ";",
      })

      console.log('Raw parsed rows:', rows)

      // Get headers from first row
      const headers = rows[0]
      console.log('CSV Headers:', headers)

      // Process data rows (skip header row)
      const dataRows = rows.slice(1).map(row => {
        const question_text = row[0]?.trim() // First column is the question text
        
        if (!question_text) {
          console.log('Skipping empty row')
          return null
        }

        return {
          category: 'general_opinion',
          question_text,
          indecision: true,
          plutot_oui: true,
          plutot_oui_duree_moderee: true,
          oui_si_equipe_medicale: true,
          plutot_non_rapidement: true,
          non_sauf_equipe_medicale: true,
          plutot_non_non_souffrance: true
        }
      }).filter(row => row !== null)

      console.log('Formatted rows for insertion:', dataRows)

      // Delete existing questions for the category
      const { error: deleteError } = await supabaseAdmin
        .from('questionnaire_questions')
        .delete()
        .eq('category', 'general_opinion')

      if (deleteError) {
        console.error('Error deleting old questions:', deleteError)
        throw deleteError
      }

      const { error: insertError } = await supabaseAdmin
        .from('questionnaire_questions')
        .insert(dataRows)

      if (insertError) {
        console.error('Error inserting new questions:', insertError)
        throw insertError
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          questionsCount: dataRows.length,
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
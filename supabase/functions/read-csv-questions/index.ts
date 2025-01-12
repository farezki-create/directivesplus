import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { parse } from 'https://deno.land/std@0.182.0/csv/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting CSV questions update process...")
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log("Downloading CSV file from storage...")
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('questionnaires')
      .download('mon_avis.csv')

    if (storageError) {
      console.error('Error downloading CSV:', storageError)
      throw storageError
    }

    // Convert the blob to text
    const text = await storageData.text()
    console.log('CSV content:', text)
    
    try {
      // Parse CSV
      const rows = parse(text, {
        skipFirstRow: true,
        separator: ";",
      })

      console.log('Parsed rows:', rows)

      // Process data rows
      const dataRows = rows
        .filter(row => row[0]?.trim()) // Filter out empty rows
        .map(row => {
          const question_text = row[0]?.trim()
          const response = row[1]?.trim().toLowerCase()
          
          return {
            category: 'general_opinion',
            question_text,
            oui: response === 'oui',
            non: response === 'non',
            indecision: false,
            plutot_oui: false,
            plutot_oui_duree_moderee: false,
            oui_si_equipe_medicale: false,
            plutot_non_rapidement: false,
            non_sauf_equipe_medicale: false,
            plutot_non_non_souffrance: false
          }
        })

      console.log('Formatted rows for insertion:', dataRows)

      // First, delete existing general_opinion questions
      const { error: deleteError } = await supabaseClient
        .from('questionnaire_questions')
        .delete()
        .eq('category', 'general_opinion')

      if (deleteError) {
        console.error('Error deleting existing questions:', deleteError)
        throw deleteError
      }

      // Insert the new questions
      const { error: insertError } = await supabaseClient
        .from('questionnaire_questions')
        .insert(dataRows)

      if (insertError) {
        console.error('Error inserting questions:', insertError)
        throw insertError
      }

      console.log('Successfully inserted questions:', dataRows)

      return new Response(
        JSON.stringify({ 
          message: 'Questions updated successfully',
          count: dataRows.length,
          questions: dataRows
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      )

    } catch (error) {
      console.error('Error parsing CSV:', error)
      throw error
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
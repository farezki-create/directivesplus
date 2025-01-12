import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'npm:xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching Excel file from storage...')
    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .download('questionnaire.xlsx')

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw new Error('Could not download Excel file')
    }

    console.log('Parsing Excel file...')
    const arrayBuffer = await fileData.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    // Chercher la feuille "autres directives"
    const sheetName = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('autres directives'))
    
    if (!sheetName) {
      throw new Error('Sheet "autres directives" not found')
    }

    console.log('Found sheet:', sheetName)
    const worksheet = workbook.Sheets[sheetName]
    const questions = XLSX.utils.sheet_to_json(worksheet)

    console.log('Questions extracted:', questions)

    // Mettre à jour la base de données avec les nouvelles questions
    const { error: deleteError } = await supabaseAdmin
      .from('questionnaire_questions')
      .delete()
      .eq('category', 'other_directives')

    if (deleteError) {
      console.error('Error deleting old questions:', deleteError)
      throw deleteError
    }

    // Insérer les nouvelles questions
    const { error: insertError } = await supabaseAdmin
      .from('questionnaire_questions')
      .insert(
        questions.map((q: any) => ({
          category: 'other_directives',
          question_text: q.question || q.Question || q['Question/Directive']
        }))
      )

    if (insertError) {
      console.error('Error inserting new questions:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, questions }),
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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { parse } from 'https://deno.land/std@0.182.0/csv/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Starting CSV questions update process...")
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: files, error: listError } = await supabaseClient
      .storage
      .from('questionnaires')
      .list()

    if (listError) {
      console.error('Error listing files:', listError)
      throw listError
    }

    console.log('Files in questionnaires bucket:', files)

    const csvFile = files.find(file => file.name === 'mon_avis.csv')
    if (!csvFile) {
      console.error('mon_avis.csv not found in bucket')
      throw new Error('CSV file not found')
    }

    console.log("Downloading CSV file from storage...")
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('questionnaires')
      .download('mon_avis.csv')

    if (storageError) {
      console.error('Error downloading CSV:', storageError)
      throw storageError
    }

    const text = await storageData.text()
    console.log('CSV content:', text)
    
    try {
      const rows = parse(text, {
        skipFirstRow: true,
        separator: ";",
        trimLeadingSpace: true,
        trimTrailingSpace: true
      })

      console.log('Parsed rows:', rows)

      const headerMappings = {
        "Question": "question_text",
        "Indécision": "indecision",
        "Oui": "oui",
        "Non": "non",
        "Oui pour une durée modérée dans un but thérapeutique mais la non soufrance est la priorité": "plutot_oui_duree_moderee",
        "Oui si l'équipe médicale le juge utile après une procédure collégiale": "oui_si_equipe_medicale",
        "Non rapidement abandonner le thérapeutique au profit de la non souffrance": "plutot_non_rapidement",
        "Non privilégier seulement la non souffrance": "plutot_non_non_souffrance"
      };

      const headers = rows[0].map(header => header.trim());
      console.log('CSV Headers:', headers);

      const dataRows = rows.slice(1)
        .filter(row => row && row.length >= headers.length && row[0]?.trim())
        .map(row => {
          const questionData = {
            category: 'general_opinion',
            question_text: '',
            question_type: 'simple',
            indecision: false,
            oui: false,
            non: false,
            plutot_oui: false,
            plutot_oui_duree_moderee: false,
            oui_si_equipe_medicale: false,
            plutot_non_rapidement: false,
            non_sauf_equipe_medicale: false,
            plutot_non_non_souffrance: false
          };

          headers.forEach((header, index) => {
            const dbField = headerMappings[header];
            if (dbField) {
              const value = row[index]?.trim().toLowerCase();
              if (dbField === 'question_text') {
                questionData[dbField] = row[index]?.trim() || '';
              } else {
                questionData[dbField] = value === 'oui' || value === '1' || value === 'true';
              }
            }
          });

          // Determine question type based on the presence of detailed options
          questionData.question_type = (
            questionData.plutot_oui_duree_moderee ||
            questionData.oui_si_equipe_medicale ||
            questionData.plutot_non_rapidement ||
            questionData.plutot_non_non_souffrance
          ) ? 'detailed' : 'simple';

          return questionData;
        });

      if (dataRows.length === 0) {
        console.error('No valid questions found in CSV')
        throw new Error('No valid questions found in CSV')
      }

      console.log('Formatted rows for insertion:', dataRows)

      const { error: deleteError } = await supabaseClient
        .from('questionnaire_questions')
        .delete()
        .eq('category', 'general_opinion')

      if (deleteError) {
        console.error('Error deleting existing questions:', deleteError)
        throw deleteError
      }

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
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
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
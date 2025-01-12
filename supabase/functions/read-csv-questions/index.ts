import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { parse } from 'https://deno.land/std@0.182.0/csv/mod.ts'

console.log("Hello from read-csv-questions!")

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the storage client
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
      // Parse CSV with the French headers
      const rows = parse(text, {
        skipFirstRow: false,
        separator: ";",
      })

      console.log('Raw parsed rows:', rows)

      // Get headers from first row
      const headers = rows[0].map((header: string) => header.trim())
      console.log('CSV headers:', headers)

      // Process data rows (skip header row)
      const dataRows = rows.slice(1).map(row => {
        const question_text = row[0]?.trim() // First column is the question text
        const response = row[1]?.trim().toLowerCase() // Second column is the response
        
        if (!question_text) {
          console.log('Skipping empty row')
          return null
        }

        return {
          category: 'general_opinion',
          question_text,
          oui: response === 'oui',
          non: response === 'non'
        }
      }).filter(row => row !== null)

      console.log('Formatted rows for insertion:', dataRows)

      // Insert the questions into the database
      const { error: insertError } = await supabaseClient
        .from('questionnaire_questions')
        .upsert(dataRows, {
          onConflict: 'question_text',
          ignoreDuplicates: false
        })

      if (insertError) {
        console.error('Error inserting questions:', insertError)
        throw insertError
      }

      return new Response(
        JSON.stringify({ message: 'Questions updated successfully' }),
        { headers: { 'Content-Type': 'application/json' } }
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
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
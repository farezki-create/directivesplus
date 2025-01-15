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
    const formData = await req.formData()
    const file = formData.get('file')
    const type = formData.get('type')

    if (!file || !type) {
      return new Response(
        JSON.stringify({ error: 'File and type are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let data: any[] = []
    const fileContent = await file.text()

    if (file.name.endsWith('.csv')) {
      const { rows } = await parse(fileContent, {
        skipFirstRow: true,
        columns: true
      })
      data = rows
    } else if (file.name.endsWith('.json')) {
      data = JSON.parse(fileContent)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported file format. Use CSV or JSON.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let tableName: string
    switch (type) {
      case 'general_opinion':
        tableName = 'questions'
        break
      case 'life_support':
        tableName = 'life_support_questions'
        break
      case 'advanced_illness':
        tableName = 'advanced_illness_questions'
        break
      case 'preferences':
        tableName = 'preferences_questions'
        break
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid question type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }

    console.log(`Importing ${data.length} questions into ${tableName}`)

    const { error } = await supabase
      .from(tableName)
      .insert(data)

    if (error) {
      console.error('Error importing data:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to import data', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Data imported successfully', 
        count: data.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Excel to CSV conversion...');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )

    // Télécharger le fichier Excel
    const { data: excelData, error: downloadError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .download('questionnaire.xlsx');

    if (downloadError) {
      console.error('Error downloading Excel file:', downloadError);
      throw new Error('Could not download Excel file');
    }

    // Convertir le fichier Excel en CSV
    const workbook = XLSX.read(await excelData.arrayBuffer(), { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const csvContent = XLSX.utils.sheet_to_csv(firstSheet);

    // Uploader le fichier CSV
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('questionnaires')
      .upload('questionnaire.csv', csvContent, {
        contentType: 'text/csv',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading CSV file:', uploadError);
      throw new Error('Could not upload CSV file');
    }

    console.log('Successfully converted Excel to CSV');
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
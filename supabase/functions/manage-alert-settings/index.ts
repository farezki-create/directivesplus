
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

interface AlertSettings {
  auto_alert_enabled: boolean;
  alert_threshold: number;
  symptom_types: string[];
  sms_enabled: boolean;
  sms_provider: 'twilio' | 'whatsapp';
  phone_number: string;
  whatsapp_number: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Vérifier l'utilisateur authentifié
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const method = req.method;
    const userId = user.id; // Toujours utiliser l'ID de l'utilisateur connecté

    if (method === 'GET') {
      // Récupérer les paramètres
      const { data, error } = await supabaseClient
        .from('patient_alert_settings')
        .select('*')
        .eq('patient_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const settings = data ? {
        auto_alert_enabled: data.auto_alert_enabled || false,
        alert_threshold: data.alert_threshold || 7,
        symptom_types: data.symptom_types || ['douleur', 'dyspnee', 'anxiete'],
        sms_enabled: data.sms_enabled || false,
        sms_provider: data.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio',
        phone_number: data.phone_number || '',
        whatsapp_number: data.whatsapp_number || ''
      } : {
        auto_alert_enabled: false,
        alert_threshold: 7,
        symptom_types: ['douleur', 'dyspnee', 'anxiete'],
        sms_enabled: false,
        sms_provider: 'twilio' as const,
        phone_number: '',
        whatsapp_number: ''
      };

      return new Response(
        JSON.stringify({ settings }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      // Sauvegarder les paramètres
      let body;
      
      try {
        const bodyText = await req.text();
        if (!bodyText || bodyText.trim() === '') {
          throw new Error('Empty request body');
        }
        body = JSON.parse(bodyText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const settings: AlertSettings = body.settings;

      const dataToSave = {
        patient_id: userId,
        auto_alert_enabled: Boolean(settings.auto_alert_enabled),
        alert_threshold: Number(settings.alert_threshold),
        symptom_types: Array.isArray(settings.symptom_types) ? settings.symptom_types : ['douleur', 'dyspnee', 'anxiete'],
        sms_enabled: Boolean(settings.sms_enabled),
        sms_provider: settings.sms_provider === 'whatsapp' ? 'whatsapp' : 'twilio',
        phone_number: settings.phone_number || null,
        whatsapp_number: settings.whatsapp_number || null
      };

      const { error } = await supabaseClient
        .from('patient_alert_settings')
        .upsert(dataToSave, {
          onConflict: 'patient_id'
        });

      if (error) {
        console.error('Error saving settings:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Vos paramètres d\'alerte ont été enregistrés avec succès.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

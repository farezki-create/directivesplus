
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestMessageRequest {
  sms_provider: 'twilio' | 'whatsapp';
  phone_number?: string;
  whatsapp_number?: string;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestData: TestMessageRequest = await req.json()
    console.log('Test message request:', requestData)

    // Simuler l'envoi selon le provider
    if (requestData.sms_provider === 'twilio') {
      // Simulation Twilio SMS
      if (!requestData.phone_number) {
        return new Response(
          JSON.stringify({ error: 'Numéro de téléphone requis pour Twilio' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log(`SMS Twilio simulé envoyé à ${requestData.phone_number}: ${requestData.message}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Message de test envoyé via SMS à ${requestData.phone_number}`,
          provider: 'twilio'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else if (requestData.sms_provider === 'whatsapp') {
      // Simulation WhatsApp
      if (!requestData.whatsapp_number) {
        return new Response(
          JSON.stringify({ error: 'Numéro WhatsApp requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log(`WhatsApp simulé envoyé à ${requestData.whatsapp_number}: ${requestData.message}`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Message de test envoyé via WhatsApp à ${requestData.whatsapp_number}`,
          provider: 'whatsapp'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Provider non supporté' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message de test:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

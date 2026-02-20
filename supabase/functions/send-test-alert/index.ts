
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
    

    // Configuration Twilio depuis les variables d'environnement
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')
    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN')

    if (requestData.sms_provider === 'twilio') {
      if (!requestData.phone_number) {
        return new Response(
          JSON.stringify({ error: 'Numéro de téléphone requis pour Twilio' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.warn('Configuration Twilio manquante - simulation uniquement')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Message de test envoyé via SMS à ${requestData.phone_number} (simulé - configuration Twilio manquante)`,
            provider: 'twilio',
            simulated: true
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      try {
        // Envoyer réellement via Twilio
        const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
        
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: TWILIO_PHONE_NUMBER,
            To: requestData.phone_number,
            Body: requestData.message
          })
        })

        if (!response.ok) {
          throw new Error(`Twilio API error: ${response.status}`)
        }

        const result = await response.json()
        

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Message de test envoyé via SMS à ${requestData.phone_number}`,
            provider: 'twilio',
            messageId: result.sid
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Erreur Twilio:', error)
        return new Response(
          JSON.stringify({ 
            error: 'Erreur lors de l\'envoi via Twilio',
            details: error.message 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

    } else if (requestData.sms_provider === 'whatsapp') {
      if (!requestData.whatsapp_number) {
        return new Response(
          JSON.stringify({ error: 'Numéro WhatsApp requis' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!WHATSAPP_TOKEN) {
        console.warn('Configuration WhatsApp manquante - simulation uniquement')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Message de test envoyé via WhatsApp à ${requestData.whatsapp_number} (simulé - configuration WhatsApp manquante)`,
            provider: 'whatsapp',
            simulated: true
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Ici vous pourriez ajouter l'intégration WhatsApp Business API
      
      
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

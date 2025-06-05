
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    console.log('🔍 Demande OTP pour email:', email)
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Générer un code OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    console.log('🎲 Code OTP généré:', otp)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Stocker le code OTP dans la base de données
    console.log('💾 Stockage du code OTP en base...')
    const { error: dbError } = await supabase
      .from('user_otp')
      .upsert({ email, otp_code: otp, expires_at })

    if (dbError) {
      console.error('❌ Erreur DB:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erreur interne' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Code OTP stocké en base')

    // Envoyer l'email via l'Edge Function send-auth-email
    console.log('📧 Envoi de l\'email...')
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          type: 'otp',
          user_data: { otp_code: otp }
        })
      })

      console.log('📧 Réponse email status:', emailResponse.status)
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error('❌ Erreur envoi email:', errorText)
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const emailResult = await emailResponse.json()
      console.log('✅ Email envoyé avec succès:', emailResult)

    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Code OTP envoyé par email' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

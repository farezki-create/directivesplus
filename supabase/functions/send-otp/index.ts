
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

    // Envoyer l'email directement avec Resend
    console.log('📧 Envoi de l\'email avec Resend...')
    
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY manquante')
      return new Response(
        JSON.stringify({ error: 'Configuration email manquante' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'DirectivesPlus <noreply@directivesplus.fr>',
          to: [email],
          subject: 'Votre code de connexion DirectivesPlus',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0;">DirectivesPlus</h1>
              </div>
              
              <h2 style="color: #333; text-align: center;">Votre code de connexion</h2>
              
              <div style="background-color: #f8fafc; border: 2px solid #2563eb; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="text-align: center; color: #666; margin: 20px 0; font-size: 16px;">
                Entrez ce code sur la page de connexion pour accéder à votre compte.
              </p>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Important :</strong> Ce code est valable 10 minutes seulement.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
                Si vous n'avez pas demandé ce code, ignorez cet email.
              </p>
            </div>
          `
        })
      })

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text()
        console.error('❌ Erreur Resend:', resendResponse.status, errorText)
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const resendResult = await resendResponse.json()
      console.log('✅ Email envoyé avec succès:', resendResult)

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

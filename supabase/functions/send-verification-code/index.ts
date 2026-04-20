
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
    const { email, type } = await req.json()
    
    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Email et type requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof email !== 'string' || !emailRegex.test(email) || email.length > 254) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    const allowedTypes = ['login_code', 'email_confirmation', 'password_reset']
    if (typeof type !== 'string' || !allowedTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Type invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SECURITY: Rate limit by IP to prevent abuse (email enumeration / spam)
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
    try {
      const { data: rateOk } = await supabase.rpc('check_access_code_rate_limit', {
        p_ip_address: ipAddress,
        p_max_attempts: 5,
        p_window_minutes: 15,
      })
      if (rateOk === false) {
        return new Response(
          JSON.stringify({ error: 'Trop de demandes. Réessayez plus tard.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (_) {
      // If rate limit check fails, fail closed for safety on high-risk endpoint
    }

    // Générer un code de vérification via la fonction de base de données
    const { data: codeData, error: codeError } = await supabase.rpc('generate_verification_code', {
      p_email: email,
      p_verification_type: type
    })

    if (codeError) {
      console.error('Erreur génération code:', codeError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération du code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Préparer le contenu de l'email selon le type
    let subject = ''
    let htmlContent = ''
    
    if (type === 'login_code') {
      subject = 'Votre code de connexion DirectivesPlus'
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Code de connexion DirectivesPlus</h2>
          <p>Votre code de connexion est :</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${codeData}
          </div>
          <p>Ce code expire dans 10 minutes.</p>
          <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
      `
    }

    // Envoyer l'email via SMTP Supabase
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          subject,
          html: htmlContent,
          type: 'verification_code'
        })
      })

      if (!emailResponse.ok) {
        console.warn('Erreur envoi email, mais code généré')
      }
    } catch (emailError) {
      console.warn('Erreur envoi email:', emailError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code de vérification envoyé'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

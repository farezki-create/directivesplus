
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
    const { email, type, user_data } = await req.json()
    
    console.log(`📧 Traitement email "${type}" pour: ${email}`)
    
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
    
    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY non configurée')
      throw new Error('Configuration email manquante')
    }

    let subject = ''
    let htmlContent = ''

    switch (type) {
      case 'signup':
        subject = 'Bienvenue sur DirectivesPlus'
        htmlContent = `
          <h1>Bienvenue sur DirectivesPlus !</h1>
          <p>Votre compte a été créé avec succès.</p>
          <p>Vous pouvez maintenant accéder à vos directives anticipées.</p>
        `
        break
      
      case 'recovery':
        subject = 'Réinitialisation de votre mot de passe'
        htmlContent = `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Une demande de réinitialisation de mot de passe a été effectuée.</p>
        `
        break
      
      case 'otp':
        const otpCode = user_data?.otp_code || 'Code non disponible'
        subject = 'Votre code de connexion DirectivesPlus'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">DirectivesPlus</h1>
            <h2>Votre code de connexion</h2>
            <p>Voici votre code de connexion à usage unique :</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p><strong>Ce code expire dans 10 minutes.</strong></p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              DirectivesPlus - Vos directives anticipées en sécurité
            </p>
          </div>
        `
        break
      
      default:
        throw new Error(`Type d'email non supporté : ${type}`)
    }

    const emailData = {
      sender: { email: 'noreply@directivesplus.fr', name: 'DirectivesPlus' },
      to: [{ email }],
      subject,
      htmlContent
    }

    console.log('📤 Envoi email via Brevo...')
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur Brevo:', errorText)
      throw new Error(`Erreur Brevo: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ Email envoyé avec succès:', result)

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

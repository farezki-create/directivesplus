
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string;
  type: 'confirmation' | 'recovery';
  confirmation_url?: string;
  recovery_url?: string;
  user_data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, type, confirmation_url, recovery_url, user_data }: EmailRequest = await req.json()
    
    console.log(`📧 Envoi email ${type} pour:`, email)

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const resend = new Resend(RESEND_API_KEY)

    let subject: string
    let htmlContent: string

    switch (type) {
      case 'confirmation':
        subject = 'Confirmez votre inscription à DirectivesPlus'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Bienvenue sur DirectivesPlus</h2>
            <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse email :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmation_url}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmer mon email
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
        `
        break

      case 'recovery':
        subject = 'Réinitialisation de votre mot de passe DirectivesPlus'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${recovery_url}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          </div>
        `
        break

      default:
        throw new Error(`Type d'email non supporté: ${type}`)
    }

    const emailResponse = await resend.emails.send({
      from: 'DirectivesPlus <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      html: htmlContent
    })

    console.log('✅ Email envoyé avec succès:', emailResponse.data?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id,
        type: type 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

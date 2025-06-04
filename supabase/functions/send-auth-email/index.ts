
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  email: string;
  type: 'confirmation' | 'recovery' | '2fa_code';
  confirmation_url?: string;
  recovery_url?: string;
  code?: string;
  user_data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🚀 Edge function send-auth-email démarrée')
    
    // Vérifier la clé API Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY non trouvée dans les variables d\'environnement')
      throw new Error('RESEND_API_KEY non configurée')
    }
    console.log('✅ RESEND_API_KEY trouvée:', resendApiKey.substring(0, 10) + '...')
    
    const resend = new Resend(resendApiKey)

    const { email, type, confirmation_url, recovery_url, code, user_data }: EmailRequest = await req.json()

    console.log(`📧 Envoi email ${type} pour:`, email)
    console.log('📝 Données reçues:', { email, type, confirmation_url, recovery_url, code })

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

      case '2fa_code':
        subject = 'Code de sécurité DirectivesPlus'
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Code de sécurité</h2>
            <p>Voici votre code de sécurité pour accéder à DirectivesPlus :</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${code}</span>
              </div>
            </div>
            <p style="color: #ef4444; font-weight: bold;">⚠️ Ce code expire dans 10 minutes</p>
            <p style="color: #666; font-size: 14px;">
              Si vous n'avez pas demandé ce code, ignorez cet email et vérifiez la sécurité de votre compte.
            </p>
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Sécurité :</strong> Ne partagez jamais ce code avec personne. L'équipe DirectivesPlus ne vous demandera jamais ce code par téléphone ou email.
              </p>
            </div>
          </div>
        `
        break

      default:
        throw new Error(`Type d'email non supporté: ${type}`)
    }

    // Utiliser l'adresse par défaut de Resend si le domaine custom n'est pas validé
    const fromAddress = 'DirectivesPlus <onboarding@resend.dev>'
    
    console.log('📤 Préparation envoi email via Resend...')
    console.log('📧 De:', fromAddress)
    console.log('📧 À:', email)
    console.log('📧 Sujet:', subject)
    
    const emailPayload = {
      from: fromAddress,
      to: [email],
      subject: subject,
      html: htmlContent
    }
    
    console.log('📦 Payload email:', JSON.stringify(emailPayload, null, 2))
    
    const emailResponse = await resend.emails.send(emailPayload)

    console.log('📧 Réponse Resend complète:', JSON.stringify(emailResponse, null, 2))

    if (emailResponse.error) {
      console.error('❌ Erreur Resend détaillée:', JSON.stringify(emailResponse.error, null, 2))
      throw new Error(`Erreur Resend: ${JSON.stringify(emailResponse.error)}`)
    }

    console.log('✅ Email envoyé avec succès via Resend')
    console.log('📧 ID de l\'email:', emailResponse.data?.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id || `directivesplus-${Date.now()}`,
        type: type,
        debug: {
          email: email,
          subject: subject,
          from: fromAddress,
          resend_configured: !!Deno.env.get('RESEND_API_KEY'),
          resend_response: emailResponse
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Erreur envoi email complète:', error)
    console.error('❌ Stack trace:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack 
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

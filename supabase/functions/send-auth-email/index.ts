
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

interface EmailRequest {
  email: string;
  type: string;
  confirmation_url?: string;
  recovery_url?: string;
  user_data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, type, confirmation_url, recovery_url, user_data }: EmailRequest = await req.json()
    
    console.log(`📧 Traitement email "${type}" pour: ${email}`)

    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY not configured')
    }

    let subject = ''
    let htmlContent = ''
    let textContent = ''

    switch (type) {
      case 'signup':
        subject = 'Bienvenue sur DirectivesPlus - Confirmez votre inscription'
        htmlContent = `
          <h2>Bienvenue sur DirectivesPlus !</h2>
          <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour confirmer votre compte :</p>
          <p><a href="${confirmation_url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirmer mon compte</a></p>
          <p>Si le bouton ne fonctionne pas, copiez ce lien : ${confirmation_url}</p>
        `
        textContent = `Bienvenue sur DirectivesPlus ! Confirmez votre compte : ${confirmation_url}`
        break

      case 'recovery':
        subject = 'DirectivesPlus - Récupération de mot de passe'
        htmlContent = `
          <h2>Récupération de mot de passe</h2>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <p><a href="${recovery_url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Réinitialiser</a></p>
          <p>Si le bouton ne fonctionne pas, copiez ce lien : ${recovery_url}</p>
        `
        textContent = `Réinitialisez votre mot de passe : ${recovery_url}`
        break

      case 'symptom_alert':
        subject = '🚨 DirectivesPlus - Alerte Symptômes Critiques'
        const patientName = user_data?.patient_name || 'Patient'
        const contactName = user_data?.contact_name || 'Contact'
        const criticalSymptoms = user_data?.critical_symptoms || []
        const alertMessage = user_data?.alert_message || 'Symptômes critiques détectés'
        
        htmlContent = `
          <div style="background-color: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #dc2626; margin: 0 0 16px 0;">🚨 ALERTE SYMPTÔMES CRITIQUES</h2>
            <p><strong>Patient :</strong> ${patientName}</p>
            <p><strong>Contact :</strong> ${contactName}</p>
            <div style="margin: 16px 0;">
              <strong>Symptômes critiques détectés :</strong>
              <ul style="margin: 8px 0;">
                ${criticalSymptoms.map((symptom: string) => `<li style="color: #dc2626;">${symptom}</li>`).join('')}
              </ul>
            </div>
            <p style="color: #dc2626; font-weight: bold;">
              Contactez immédiatement le patient ou les services d'urgence si nécessaire.
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              DirectivesPlus - ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        `
        textContent = alertMessage
        break

      default:
        throw new Error(`Type d'email non supporté : ${type}`)
    }

    const emailData = {
      sender: {
        name: "DirectivesPlus",
        email: "noreply@directivesplus.fr"
      },
      to: [{ email: email }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent
    }

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Api-Key': BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    console.log('✅ Email envoyé via Brevo:', result)

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  email: string;
  type: string;
  confirmation_url?: string;
  recovery_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, type, confirmation_url, recovery_url }: EmailRequest = await req.json()
    
    

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

      default:
        throw new Error(`Type d'email non supporté : ${type}`)
    }

    

    return new Response(
      JSON.stringify({ success: true, message: 'Email traité' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur traitement email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

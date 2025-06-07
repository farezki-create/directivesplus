
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🚀 Function send-otp started, method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.text()
    console.log('📧 Raw request body:', requestBody)
    
    let parsedBody
    try {
      parsedBody = JSON.parse(requestBody)
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const { email } = parsedBody
    console.log('📧 Extracted email:', email)
    
    if (!email) {
      console.error('❌ No email provided')
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email)
      return new Response(
        JSON.stringify({ error: 'Format email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasResendKey: !!resendApiKey
    })
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Configuration serveur incorrecte' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!resendApiKey) {
      console.error('❌ Missing RESEND_API_KEY')
      return new Response(
        JSON.stringify({ error: 'Configuration email manquante' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Générer un code OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    console.log('🎲 Generated OTP:', otp, 'expires at:', expires_at)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Supprimer les anciens codes OTP pour cet email
    console.log('🧹 Cleaning old OTP codes for email:', email)
    const { error: deleteError } = await supabase
      .from('user_otp')
      .delete()
      .eq('email', email)
    
    if (deleteError) {
      console.log('⚠️ Delete old codes warning (may be normal):', deleteError)
    }

    // Stocker le nouveau code OTP dans la base de données
    console.log('💾 Storing OTP in database...')
    const { error: dbError, data: insertData } = await supabase
      .from('user_otp')
      .insert({ 
        email: email, 
        otp_code: otp, 
        expires_at: expires_at 
      })
      .select()

    if (dbError) {
      console.error('❌ Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erreur base de données: ' + dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ OTP stored in database:', insertData)

    // Envoyer l'email avec Resend
    console.log('📧 Sending email via Resend to:', email)
    
    try {
      const emailPayload = {
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
      }
      
      console.log('📧 Email payload prepared for:', email)

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      })

      const responseText = await resendResponse.text()
      console.log('📧 Resend response status:', resendResponse.status)
      console.log('📧 Resend response body:', responseText)

      if (!resendResponse.ok) {
        console.error('❌ Resend API error:', resendResponse.status, responseText)
        
        // Essayer de parser la réponse d'erreur
        let errorDetails = 'Unknown error'
        try {
          const errorData = JSON.parse(responseText)
          errorDetails = errorData.message || errorData.error || responseText
        } catch (e) {
          errorDetails = responseText
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Erreur envoi email: ' + errorDetails,
            details: {
              status: resendResponse.status,
              response: responseText
            }
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let resendData
      try {
        resendData = JSON.parse(responseText)
      } catch (e) {
        console.log('⚠️ Could not parse Resend response as JSON, but request was successful')
        resendData = { id: 'unknown', message: 'Email sent successfully' }
      }

      console.log('✅ Email sent successfully via Resend:', resendData)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Code OTP envoyé par email',
          email: email,
          messageId: resendData.id 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (emailError) {
      console.error('❌ Email sending error:', emailError)
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi de l\'email: ' + emailError.message,
          details: emailError.toString()
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('❌ General error in send-otp function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur générale: ' + error.message,
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

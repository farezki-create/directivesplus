
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🚀 Function verify-otp started, method:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.text()
    console.log('🔍 Raw request body:', requestBody)
    
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
    
    const { email, otp_code } = parsedBody
    console.log('🔍 Verification request for email:', email, 'with code:', otp_code)
    
    if (!email || !otp_code) {
      console.error('❌ Missing email or OTP code')
      return new Response(
        JSON.stringify({ error: 'Email et code OTP requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Configuration serveur incorrecte' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Vérifier le code OTP
    console.log('🔍 Looking for OTP code in database...')
    const { data, error } = await supabase
      .from('user_otp')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp_code)
      .single()

    if (error || !data) {
      console.error('❌ OTP code not found or error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Code OTP invalide',
          error: error?.message 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ OTP code found in database:', data)

    // Vérifier si le code n'est pas expiré
    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    console.log('⏰ Time check - Now:', now.toISOString(), 'Expires:', expiresAt.toISOString())
    
    if (expiresAt < now) {
      console.log('❌ OTP code expired')
      // Supprimer le code expiré
      await supabase.from('user_otp').delete().eq('email', email)
      return new Response(
        JSON.stringify({ success: false, message: 'Code OTP expiré' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ OTP code is valid and not expired')

    // Supprimer le code OTP utilisé
    console.log('🧹 Deleting used OTP code...')
    const { error: deleteError } = await supabase.from('user_otp').delete().eq('email', email)
    
    if (deleteError) {
      console.log('⚠️ Warning deleting OTP code:', deleteError)
    }

    // Créer ou récupérer l'utilisateur Supabase
    console.log('👤 Creating/retrieving Supabase user for email:', email)
    
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true
      })

      if (authError && !authError.message.includes('User already registered')) {
        console.error('❌ Auth error creating user:', authError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Erreur d\'authentification: ' + authError.message 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ User created/retrieved:', authData?.user?.email)

      // Générer un lien de connexion magique
      console.log('🔗 Generating magic link for authentication...')
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email
      })

      if (linkError) {
        console.error('❌ Magic link generation error:', linkError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Erreur génération session: ' + linkError.message 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ Magic link generated successfully')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Code OTP vérifié avec succès',
          auth_url: linkData.properties?.action_link,
          email: email
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (userError) {
      console.error('❌ User management error:', userError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erreur gestion utilisateur: ' + userError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('❌ General error in verify-otp function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur générale: ' + error.message,
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

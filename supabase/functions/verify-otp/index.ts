
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

    // Vérifier ou créer l'utilisateur dans Supabase Auth
    console.log('👤 Checking if user exists for email:', email)
    
    const { data: userExists, error: userError } = await supabase.auth.admin.getUserByEmail(email)
    let userId

    if (userExists?.user) {
      console.log('✅ User exists:', userExists.user.email)
      userId = userExists.user.id
    } else {
      console.log('👤 Creating new user for email:', email)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true
      })

      if (createError || !newUser?.user) {
        console.error('❌ Error creating user:', createError)
        return new Response(
          JSON.stringify({ error: 'Erreur création utilisateur: ' + createError?.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log('✅ New user created:', newUser.user.email)
      userId = newUser.user.id
    }

    // Créer une session directement avec les tokens
    console.log('🔐 Creating session tokens for user:', userId)
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateAccessToken({
        user_id: userId,
        expires_in: 3600 // 1 heure
      })

      if (sessionError || !sessionData) {
        console.error('❌ Error creating session:', sessionError)
        return new Response(
          JSON.stringify({ error: 'Erreur création session: ' + sessionError?.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ Session tokens created successfully')

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Code OTP vérifié avec succès',
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
          user_id: userId,
          email: email
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (tokenError) {
      console.error('❌ Token generation error:', tokenError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Erreur génération tokens: ' + tokenError.message 
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

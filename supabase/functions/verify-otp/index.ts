
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
    const { email, otp_code } = await req.json()
    
    if (!email || !otp_code) {
      return new Response(
        JSON.stringify({ error: 'Email et code OTP requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Vérifier le code OTP
    const { data, error } = await supabase
      .from('user_otp')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp_code)
      .single()

    if (error || !data) {
      return new Response(
        JSON.stringify({ success: false, message: 'Code OTP invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si le code n'est pas expiré
    if (new Date(data.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ success: false, message: 'Code OTP expiré' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Supprimer le code OTP utilisé
    await supabase
      .from('user_otp')
      .delete()
      .eq('email', email)

    // Créer ou récupérer l'utilisateur Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true
    })

    if (authError && authError.message !== 'User already registered') {
      console.error('Erreur auth:', authError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erreur d\'authentification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Générer un lien de connexion magique
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email
    })

    if (linkError) {
      console.error('Erreur génération lien:', linkError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erreur génération session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code OTP vérifié avec succès',
        auth_url: linkData.properties?.action_link
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

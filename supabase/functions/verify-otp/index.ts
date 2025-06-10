
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
    console.log('🔐 Début de vérification OTP');
    
    const { email, otp_code } = await req.json()
    
    if (!email || !otp_code) {
      console.error('❌ Email ou code OTP manquant');
      return new Response(
        JSON.stringify({ error: 'Email et code OTP requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔐 Vérification OTP pour:', email, 'code:', otp_code);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Vérifier le code OTP
    const { data, error } = await supabase
      .from('user_otp')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp_code)
      .eq('used', false)
      .single()

    console.log('🔍 Résultat recherche OTP:', data ? 'trouvé' : 'non trouvé', error?.message || '');

    if (error || !data) {
      console.error('❌ Code OTP invalide ou non trouvé');
      return new Response(
        JSON.stringify({ success: false, message: 'Code OTP invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si le code n'est pas expiré
    if (new Date(data.expires_at) < new Date()) {
      console.error('❌ Code OTP expiré');
      return new Response(
        JSON.stringify({ success: false, message: 'Code OTP expiré' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Marquer le code comme utilisé
    await supabase
      .from('user_otp')
      .update({ used: true })
      .eq('id', data.id)

    console.log('✅ Code OTP marqué comme utilisé');

    // Récupérer l'utilisateur avec la nouvelle méthode
    let user = null;
    try {
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      if (!listError && users) {
        const foundUser = users.users.find(u => u.email === email)
        if (foundUser) {
          user = { user: foundUser };
          console.log('👤 Utilisateur trouvé:', foundUser.id);
        }
      }
    } catch (error) {
      console.error('❌ Erreur récupération utilisateur:', error);
    }
    
    if (!user) {
      console.error('❌ Utilisateur introuvable:', email);
      return new Response(
        JSON.stringify({ success: false, message: 'Utilisateur introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Confirmer l'email de l'utilisateur
    try {
      await supabase.auth.admin.updateUserById(user.user.id, {
        email_confirm: true
      })
      console.log('✅ Email confirmé pour l\'utilisateur');
    } catch (error) {
      console.warn('⚠️ Erreur confirmation email:', error);
    }

    // Générer une session pour l'utilisateur
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email
    })

    if (linkError) {
      console.error('❌ Erreur génération lien:', linkError)
      return new Response(
        JSON.stringify({ success: false, message: 'Erreur génération session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Session générée avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code OTP vérifié avec succès',
        access_token: linkData.properties?.access_token,
        refresh_token: linkData.properties?.refresh_token,
        user: user.user
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

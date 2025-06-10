
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
    console.log('📧 Début de l\'envoi d\'OTP');
    
    const { email } = await req.json()
    
    if (!email) {
      console.error('❌ Email manquant dans la requête');
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('📧 Email reçu:', email);

    // Générer un code OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    console.log('🔢 Code OTP généré:', otp);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Variables d\'environnement manquantes');
      return new Response(
        JSON.stringify({ error: 'Configuration serveur incorrecte' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Vérifier si l'utilisateur existe déjà dans la table auth.users
    let userExists = false;
    let userId = null;

    try {
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      if (!listError && users) {
        const existingUser = users.users.find(u => u.email === email)
        if (existingUser) {
          userExists = true;
          userId = existingUser.id;
          console.log('👤 Utilisateur existant trouvé:', existingUser.id);
        }
      }
    } catch (error) {
      console.log('⚠️ Erreur lors de la vérification utilisateur:', error);
    }

    // Si l'utilisateur n'existe pas, le créer
    if (!userExists) {
      console.log('👤 Création d\'un nouvel utilisateur pour:', email);
      try {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { registration_method: 'otp' }
        })
        
        if (createError) {
          console.error('❌ Erreur création utilisateur:', createError);
          return new Response(
            JSON.stringify({ error: 'Erreur création utilisateur' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        if (newUser.user) {
          userId = newUser.user.id;
          console.log('✅ Utilisateur créé avec succès:', userId);
        }
      } catch (error) {
        console.error('❌ Erreur inattendue création utilisateur:', error);
        return new Response(
          JSON.stringify({ error: 'Erreur création utilisateur' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Supprimer les anciens codes OTP non utilisés pour cet email
    try {
      await supabase
        .from('user_otp')
        .delete()
        .eq('email', email)
        .eq('used', false)
    } catch (error) {
      console.warn('⚠️ Erreur suppression anciens OTP:', error);
    }

    // Stocker le code OTP dans la base de données
    const { error: dbError } = await supabase
      .from('user_otp')
      .insert({ 
        email, 
        otp_code: otp, 
        expires_at 
      })

    if (dbError) {
      console.error('❌ Erreur stockage OTP en DB:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erreur interne' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Code OTP stocké en base de données');

    // Envoyer l'email via l'Edge Function existante send-auth-email
    try {
      console.log('📧 Tentative d\'envoi d\'email...');
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          type: 'otp',
          user_data: { otp_code: otp }
        })
      })

      const emailResult = await emailResponse.text()
      console.log('📧 Réponse email service:', emailResponse.status, emailResult);

      if (!emailResponse.ok) {
        console.warn('⚠️ Erreur envoi email, mais OTP stocké. Status:', emailResponse.status)
      } else {
        console.log('✅ Email envoyé avec succès');
      }
    } catch (emailError) {
      console.warn('⚠️ Erreur envoi email:', emailError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code OTP envoyé par email',
        debug: { email, otp: otp } // À supprimer en production
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

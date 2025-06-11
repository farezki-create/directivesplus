
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyOTPRequest {
  email: string;
  otp_code: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: any;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔐 [VERIFY-OTP] Début de la vérification OTP');
    
    // Parse request body
    let requestBody: VerifyOTPRequest;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('❌ [VERIFY-OTP] Erreur parsing JSON:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Corps de requête invalide' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, otp_code } = requestBody;
    
    // Validate inputs
    if (!email || !otp_code) {
      console.error('❌ [VERIFY-OTP] Paramètres manquants:', { email: !!email, otp_code: !!otp_code });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email et code OTP requis' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof otp_code !== 'string' || otp_code.length !== 6 || !/^\d{6}$/.test(otp_code)) {
      console.error('❌ [VERIFY-OTP] Format de code OTP invalide:', otp_code);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code OTP invalide (doit être 6 chiffres)' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 [VERIFY-OTP] Vérification pour email:', email, 'code:', otp_code);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [VERIFY-OTP] Variables d\'environnement manquantes');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuration serveur incorrecte' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify OTP code
    let otpRecord = null;
    try {
      const { data, error: otpError } = await supabase
        .from('user_otp')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('otp_code', otp_code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('🔍 [VERIFY-OTP] Résultat recherche OTP:', data ? `trouvé ${data.length} résultat(s)` : 'non trouvé', otpError?.message || '');

      if (otpError) {
        console.error('❌ [VERIFY-OTP] Erreur recherche OTP:', otpError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Erreur lors de la vérification du code' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!data || data.length === 0) {
        console.error('❌ [VERIFY-OTP] Code OTP invalide ou non trouvé');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Code OTP invalide ou expiré' 
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Take the most recent valid OTP
      otpRecord = data[0];
      
    } catch (error) {
      console.error('❌ [VERIFY-OTP] Erreur inattendue recherche OTP:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la vérification du code' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('user_otp')
      .update({ 
        used: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('❌ [VERIFY-OTP] Erreur marquage code utilisé:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la validation du code' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [VERIFY-OTP] Code OTP marqué comme utilisé');

    // Find user in auth.users
    let user = null;
    try {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('❌ [VERIFY-OTP] Erreur listUsers:', listError);
      } else if (users) {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          user = foundUser;
          console.log('👤 [VERIFY-OTP] Utilisateur trouvé:', foundUser.id);
        }
      }
    } catch (error) {
      console.error('❌ [VERIFY-OTP] Erreur récupération utilisateur:', error);
    }
    
    if (!user) {
      console.error('❌ [VERIFY-OTP] Utilisateur introuvable pour email:', email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Compte utilisateur introuvable' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Confirm user email if not confirmed
    try {
      if (!user.email_confirmed_at) {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, {
          email_confirm: true
        });
        
        if (confirmError) {
          console.warn('⚠️ [VERIFY-OTP] Erreur confirmation email:', confirmError);
        } else {
          console.log('✅ [VERIFY-OTP] Email confirmé pour utilisateur');
        }
      }
    } catch (error) {
      console.warn('⚠️ [VERIFY-OTP] Erreur inattendue confirmation email:', error);
    }

    // Generate session tokens using sign in with password bypass
    try {
      console.log('🔐 [VERIFY-OTP] Génération session pour utilisateur:', user.id);
      
      // Use admin.generateLink to create session tokens
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/profile`
        }
      });

      if (linkError) {
        console.error('❌ [VERIFY-OTP] Erreur génération session tokens:', linkError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Erreur lors de la génération des tokens de session' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ [VERIFY-OTP] Session tokens générés avec succès');

      const response: VerifyOTPResponse = {
        success: true,
        message: 'Code OTP vérifié avec succès',
        access_token: linkData.properties?.access_token,
        refresh_token: linkData.properties?.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at || new Date().toISOString(),
          user_metadata: user.user_metadata
        }
      };

      console.log('🎉 [VERIFY-OTP] Réponse succès préparée');

      return new Response(
        JSON.stringify(response),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error('❌ [VERIFY-OTP] Erreur génération session:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la génération de la session' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('❌ [VERIFY-OTP] Erreur générale:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erreur serveur interne'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendOTPRequest {
  email: string;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
  debug?: {
    email: string;
    otp: string;
  };
  error?: string;
}

serve(async (req) => {
  console.log('📨 [SEND-OTP] Nouvelle requête reçue:', req.method);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ [SEND-OTP] Réponse CORS preflight');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 [SEND-OTP] Début du processus d\'envoi OTP');
    console.log('🔧 [SEND-OTP] Variables d\'environnement disponibles:', {
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      supabaseUrl: Deno.env.get('SUPABASE_URL')?.substring(0, 30) + '...'
    });
    
    // Parse request body
    let requestBody: SendOTPRequest;
    try {
      const bodyText = await req.text();
      console.log('📝 [SEND-OTP] Corps de la requête brut:', bodyText);
      requestBody = JSON.parse(bodyText);
      console.log('📝 [SEND-OTP] Corps de la requête parsé:', requestBody);
    } catch (error) {
      console.error('❌ [SEND-OTP] Erreur parsing JSON:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Corps de requête invalide' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email } = requestBody;
    
    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('❌ [SEND-OTP] Email invalide:', email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email invalide ou manquant' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📧 [SEND-OTP] Email valide reçu:', email);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [SEND-OTP] Variables d\'environnement manquantes');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuration serveur incorrecte' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('🔗 [SEND-OTP] Initialisation client Supabase...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Generate OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    console.log('🔢 [SEND-OTP] Code OTP généré:', otpCode);

    // Clean up old OTP codes for this email (critical fix)
    try {
      console.log('🗑️ [SEND-OTP] Suppression des anciens codes...');
      const { error: deleteError } = await supabase
        .from('user_otp')
        .delete()
        .eq('email', email.toLowerCase().trim());
      
      if (deleteError) {
        console.warn('⚠️ [SEND-OTP] Erreur suppression anciens OTP:', deleteError);
      } else {
        console.log('✅ [SEND-OTP] Anciens codes OTP supprimés pour:', email);
      }
    } catch (error) {
      console.warn('⚠️ [SEND-OTP] Erreur inattendue suppression anciens OTP:', error);
    }

    // Check if user exists in auth.users
    let userExists = false;
    let userId = null;

    try {
      console.log('👤 [SEND-OTP] Vérification utilisateur existant...');
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('❌ [SEND-OTP] Erreur listUsers:', listError);
      } else if (users) {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          userExists = true;
          userId = existingUser.id;
          console.log('👤 [SEND-OTP] Utilisateur existant trouvé:', userId);
        } else {
          console.log('👤 [SEND-OTP] Aucun utilisateur existant trouvé');
        }
      }
    } catch (error) {
      console.warn('⚠️ [SEND-OTP] Erreur lors de la vérification utilisateur:', error);
    }

    // Create user if doesn't exist
    if (!userExists) {
      console.log('👤 [SEND-OTP] Création d\'un nouvel utilisateur pour:', email);
      try {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
          user_metadata: { 
            registration_method: 'otp',
            created_via: 'send_otp_function'
          }
        });
        
        if (createError) {
          console.error('❌ [SEND-OTP] Erreur création utilisateur:', createError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Erreur lors de la création du compte' 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (newUser.user) {
          userId = newUser.user.id;
          console.log('✅ [SEND-OTP] Utilisateur créé avec succès:', userId);
        }
      } catch (error) {
        console.error('❌ [SEND-OTP] Erreur inattendue création utilisateur:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Erreur lors de la création du compte' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Insert new OTP code
    try {
      console.log('💾 [SEND-OTP] Insertion du code OTP en base...');
      const { data: otpData, error: insertError } = await supabase
        .from('user_otp')
        .insert({ 
          email: email.toLowerCase().trim(), 
          otp_code: otpCode, 
          expires_at: expiresAt,
          used: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ [SEND-OTP] Erreur insertion OTP:', insertError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Erreur lors de la génération du code' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ [SEND-OTP] Code OTP inséré en DB:', otpData);
    } catch (error) {
      console.error('❌ [SEND-OTP] Erreur inattendue insertion OTP:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erreur lors de la génération du code' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Edge Function
    try {
      console.log('📧 [SEND-OTP] Tentative d\'envoi d\'email...');
      
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-auth-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          type: 'otp',
          user_data: { 
            otp_code: otpCode,
            expires_in: '10 minutes'
          }
        })
      });

      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.warn('⚠️ [SEND-OTP] Erreur envoi email:', emailResponse.status, emailError);
      } else {
        console.log('✅ [SEND-OTP] Email envoyé avec succès');
      }
    } catch (emailError) {
      console.warn('⚠️ [SEND-OTP] Erreur lors de l\'envoi d\'email:', emailError);
    }

    // Success response
    const response: SendOTPResponse = {
      success: true,
      message: 'Code OTP envoyé par email'
    };

    // Add debug info in development
    if (Deno.env.get('DENO_ENV') !== 'production') {
      response.debug = {
        email,
        otp: otpCode
      };
    }

    console.log('✅ [SEND-OTP] Processus terminé avec succès');

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ [SEND-OTP] Erreur générale:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erreur serveur interne'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

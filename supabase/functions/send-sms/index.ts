
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const brevoApiKey = Deno.env.get('BREVO_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SmsRequest {
  to: string;
  message: string;
  sender?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!brevoApiKey) {
    return new Response(
      JSON.stringify({ error: 'Clé API Brevo manquante' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Create Supabase client with service role key for secure operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token d\'authentification requis' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token d\'authentification invalide' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { to, message, sender = 'DirectivesPlus' }: SmsRequest = await req.json();

    // Validation des données
    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: 'Numéro de téléphone et message requis' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get client IP and User Agent for security logging
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // Check rate limit using the new secure function
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_sms_rate_limit', { p_user_id: user.id });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return new Response(
        JSON.stringify({ error: 'Erreur de vérification du taux de limite' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!rateLimitCheck) {
      return new Response(
        JSON.stringify({ 
          error: 'Limite de SMS atteinte. Maximum 5 SMS par heure.',
          retryAfter: 3600 
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log SMS attempt
    const { data: logId, error: logError } = await supabase
      .rpc('log_sms_attempt', {
        p_user_id: user.id,
        p_recipient_phone: to,
        p_message_content: message.substring(0, 160), // Truncate for storage
        p_sender_name: sender.substring(0, 11),
        p_ip_address: clientIP,
        p_user_agent: userAgent
      });

    if (logError) {
      console.error('Logging error:', logError);
    }

    // Formater le numéro de téléphone (supprimer les espaces et caractères spéciaux)
    const formattedPhone = to.replace(/\D/g, '');
    
    // Ajouter le préfixe international français si nécessaire
    const phoneNumber = formattedPhone.startsWith('33') ? formattedPhone : `33${formattedPhone.substring(1)}`;

    // Validate phone number format (basic French mobile validation)
    if (!/^33[67]\d{8}$/.test(phoneNumber)) {
      if (logId) {
        await supabase.rpc('update_sms_status', {
          p_log_id: logId,
          p_status: 'failed',
          p_error_message: 'Invalid phone number format'
        });
      }
      
      return new Response(
        JSON.stringify({ error: 'Format de numéro de téléphone invalide' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Sanitize message content
    const sanitizedMessage = message.substring(0, 160).replace(/[<>]/g, '');

    // Appel à l'API Brevo pour envoyer le SMS
    const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'transactional',
        unicodeEnabled: true,
        recipient: phoneNumber,
        content: sanitizedMessage,
        sender: sender.substring(0, 11), // Limite de 11 caractères pour le sender
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erreur Brevo SMS:', responseData);
      
      // Update log with failure
      if (logId) {
        await supabase.rpc('update_sms_status', {
          p_log_id: logId,
          p_status: 'failed',
          p_error_message: JSON.stringify(responseData)
        });
      }

      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi du SMS',
          details: responseData 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('SMS envoyé avec succès:', responseData);

    // Update log with success
    if (logId) {
      await supabase.rpc('update_sms_status', {
        p_log_id: logId,
        p_status: 'sent',
        p_brevo_message_id: responseData.reference
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.reference,
        message: 'SMS envoyé avec succès' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);

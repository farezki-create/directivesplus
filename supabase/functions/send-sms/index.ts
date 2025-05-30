
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const brevoApiKey = Deno.env.get('BREVO_API_KEY');

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

  try {
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

    // Formater le numéro de téléphone (supprimer les espaces et caractères spéciaux)
    const formattedPhone = to.replace(/\D/g, '');
    
    // Ajouter le préfixe international français si nécessaire
    const phoneNumber = formattedPhone.startsWith('33') ? formattedPhone : `33${formattedPhone.substring(1)}`;

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
        content: message,
        sender: sender.substring(0, 11), // Limite de 11 caractères pour le sender
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erreur Brevo SMS:', responseData);
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

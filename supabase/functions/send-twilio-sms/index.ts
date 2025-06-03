
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  phoneNumber: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📱 Début de l'envoi SMS via Twilio");
    
    const { phoneNumber, userId }: SMSRequest = await req.json();
    
    console.log("Paramètres reçus:", { phoneNumber: phoneNumber.substring(0, 5) + "****", userId });

    // Générer un code à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Code généré:", verificationCode);

    // Préparer les credentials Twilio
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error("Configuration Twilio manquante");
    }

    // Construire l'URL Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Préparer le message
    const message = `DirectivesPlus - Votre code de vérification : ${verificationCode}. Ce code expire dans 5 minutes.`;
    
    // Préparer les données pour Twilio
    const formData = new URLSearchParams();
    formData.append('From', twilioPhoneNumber);
    formData.append('To', phoneNumber);
    formData.append('Body', message);

    // Créer l'authentification Basic
    const auth = btoa(`${accountSid}:${authToken}`);

    // Envoyer le SMS via Twilio
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const twilioResponse = await response.json();
    
    if (!response.ok) {
      console.error("❌ Erreur Twilio:", twilioResponse);
      throw new Error(twilioResponse.message || "Erreur lors de l'envoi SMS");
    }

    console.log("✅ SMS envoyé avec succès via Twilio:", twilioResponse.sid);

    // TODO: En production, stocker le code en base de données avec une expiration
    // Pour l'instant, on retourne le code pour les tests
    return new Response(
      JSON.stringify({ 
        success: true,
        code: verificationCode, // À supprimer en production
        messageSid: twilioResponse.sid,
        message: "SMS envoyé avec succès"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("❌ Erreur lors de l'envoi SMS:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Erreur lors de l'envoi SMS"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

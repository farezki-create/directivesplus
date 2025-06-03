
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  phoneNumber: string;
  userId: string;
  message?: string;
  codeOnly?: boolean; // Nouveau paramètre pour envoyer seulement un code
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📱 Début de l'envoi SMS via Twilio");
    
    const { phoneNumber, userId, message, codeOnly }: SMSRequest = await req.json();
    
    console.log("Paramètres reçus:", { 
      phoneNumber: phoneNumber.substring(0, 5) + "****", 
      userId,
      hasCustomMessage: !!message,
      codeOnly: !!codeOnly
    });

    // Préparer les credentials Twilio
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error("❌ Configuration Twilio manquante");
      throw new Error("Configuration Twilio manquante");
    }

    console.log("✅ Configuration Twilio trouvée");

    // Construire l'URL Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    let smsMessage: string;
    let verificationCode: string | null = null;

    if (codeOnly) {
      // Générer un code de 6 chiffres pour la vérification
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      smsMessage = `DirectivesPlus - Votre code de vérification : ${verificationCode}. Ce code expire dans 10 minutes.`;
    } else {
      // Message de bienvenue par défaut ou personnalisé
      smsMessage = message || `Bienvenue sur DirectivesPlus ! 🏥

Votre inscription a été confirmée avec succès. Vous pouvez maintenant accéder à votre espace personnel sécurisé pour gérer vos directives anticipées.

Votre santé, vos choix. 💙

DirectivesPlus - www.directivesplus.fr`;
    }
    
    // Préparer les données pour Twilio
    const formData = new URLSearchParams();
    formData.append('From', twilioPhoneNumber);
    formData.append('To', phoneNumber);
    formData.append('Body', smsMessage);

    // Créer l'authentification Basic
    const auth = btoa(`${accountSid}:${authToken}`);

    console.log("📤 Envoi du SMS via l'API Twilio...");

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

    return new Response(
      JSON.stringify({ 
        success: true,
        messageSid: twilioResponse.sid,
        message: "SMS envoyé avec succès",
        phoneNumber: phoneNumber.substring(0, 5) + "****",
        code: verificationCode // Retourner le code pour les tests (à supprimer en production)
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

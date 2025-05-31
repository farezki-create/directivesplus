
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsRequest, createErrorResponse, createSuccessResponse } from './corsHelpers.ts';
import { validateEmailRequest } from './emailValidator.ts';
import { sendEmailViaResend } from './resendService.ts';

const resendApiKey = Deno.env.get('RESEND_API_KEY');

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Début de la fonction send-otp-email');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  if (!resendApiKey) {
    console.error('❌ Clé API Resend manquante');
    return createErrorResponse('Configuration manquante : clé API Resend');
  }

  try {
    const requestBody = await req.text();
    console.log('📧 Corps de la requête reçu:', requestBody);
    
    const requestData = JSON.parse(requestBody);
    
    // Validation des données
    const validation = validateEmailRequest(requestData);
    if (!validation.isValid) {
      return createErrorResponse(validation.error!, 400);
    }

    console.log('✅ Validation réussie, préparation de l\'email pour:', validation.emailRequest!.to);

    // Envoi de l'email via Resend
    const result = await sendEmailViaResend(validation.emailRequest!, resendApiKey);
    
    if (result.success) {
      return createSuccessResponse({
        success: true,
        messageId: result.messageId,
        message: result.message
      });
    } else {
      return createErrorResponse(
        result.message,
        400,
        {
          details: result.details,
          debug: result.debug
        }
      );
    }

  } catch (error: any) {
    console.error('💥 Erreur dans send-otp-email:', error);
    
    return createErrorResponse(
      error.message || 'Erreur interne du serveur',
      500,
      {
        stack: error.stack,
        debug: {
          name: error.name,
          cause: error.cause
        }
      }
    );
  }
};

serve(handler);

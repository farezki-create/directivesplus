
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsRequest, createErrorResponse, createSuccessResponse } from './corsHelpers.ts';
import { validateEmailRequest } from './emailValidator.ts';
import { sendEmailViaSES } from './sesService.ts';

const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
const awsRegion = Deno.env.get('AWS_REGION');

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Début de la fonction send-aws-email');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsRequest();
  }

  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
    console.error('❌ Clés AWS manquantes');
    return createErrorResponse('Configuration manquante : clés AWS');
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

    // Envoi de l'email via AWS SES
    const result = await sendEmailViaSES(validation.emailRequest!, {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: awsRegion
    });
    
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
    console.error('💥 Erreur dans send-aws-email:', error);
    
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

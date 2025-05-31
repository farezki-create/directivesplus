
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
const awsRegion = Deno.env.get('AWS_REGION');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  phoneNumber: string;
  message: string;
  type: 'verification' | 'notification';
}

async function signAWSRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  credentials: { accessKeyId: string; secretAccessKey: string; region: string }
): Promise<Record<string, string>> {
  const encoder = new TextEncoder();
  
  const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = date.substr(0, 8);
  
  const credentialScope = `${dateStamp}/${credentials.region}/sns/aws4_request`;
  const algorithm = 'AWS4-HMAC-SHA256';
  
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(key => `${key.toLowerCase()}:${headers[key]}`)
    .join('\n') + '\n';
    
  const signedHeaders = Object.keys(headers)
    .map(key => key.toLowerCase())
    .sort()
    .join(';');
    
  const payloadHash = await crypto.subtle.digest('SHA-256', encoder.encode(body))
    .then(buffer => Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''));
      
  const canonicalRequest = [
    method,
    '/',
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
  
  const canonicalRequestHash = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest))
    .then(buffer => Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''));
      
  const stringToSign = [
    algorithm,
    date,
    credentialScope,
    canonicalRequestHash
  ].join('\n');
  
  async function hmac(key: CryptoKey | Uint8Array, message: string): Promise<Uint8Array> {
    const keyToUse = key instanceof CryptoKey ? key : await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', keyToUse, encoder.encode(message));
    return new Uint8Array(signature);
  }
  
  const kDate = await hmac(encoder.encode(`AWS4${credentials.secretAccessKey}`), dateStamp);
  const kRegion = await hmac(kDate, credentials.region);
  const kService = await hmac(kRegion, 'sns');
  const kSigning = await hmac(kService, 'aws4_request');
  const signature = await hmac(kSigning, stringToSign);
  
  const signatureHex = Array.from(signature)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  const authorization = `${algorithm} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signatureHex}`;
  
  return {
    ...headers,
    'Authorization': authorization,
    'X-Amz-Date': date
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📱 Début de la fonction send-sms');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
    console.error('❌ Clés AWS manquantes');
    return new Response(
      JSON.stringify({ error: 'Configuration manquante : clés AWS' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const requestData: SMSRequest = await req.json();
    const { phoneNumber, message, type } = requestData;

    if (!phoneNumber || !message) {
      return new Response(
        JSON.stringify({ error: 'Numéro de téléphone et message requis' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📱 Envoi SMS vers:', phoneNumber);

    const snsEndpoint = `https://sns.${awsRegion}.amazonaws.com/`;
    
    const params = new URLSearchParams();
    params.append('Action', 'Publish');
    params.append('Version', '2010-03-31');
    params.append('PhoneNumber', phoneNumber);
    params.append('Message', message);
    params.append('MessageAttributes.AWS.SNS.SMS.SMSType.DataType', 'String');
    params.append('MessageAttributes.AWS.SNS.SMS.SMSType.StringValue', type === 'verification' ? 'Transactional' : 'Promotional');
    
    const body = params.toString();
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': `sns.${awsRegion}.amazonaws.com`
    };
    
    const signedHeaders = await signAWSRequest('POST', snsEndpoint, headers, body, {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
      region: awsRegion
    });
    
    const response = await fetch(snsEndpoint, {
      method: 'POST',
      headers: signedHeaders,
      body: body
    });

    const responseText = await response.text();
    
    console.log('📨 Réponse SNS:', {
      status: response.status,
      ok: response.ok,
      data: responseText
    });

    if (!response.ok) {
      console.error('❌ Erreur SNS:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi du SMS',
          details: responseText
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract MessageId from XML response
    const messageIdMatch = responseText.match(/<MessageId>(.+?)<\/MessageId>/);
    const messageId = messageIdMatch ? messageIdMatch[1] : 'unknown';

    console.log('✅ SMS envoyé avec succès:', messageId);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: messageId,
        message: 'SMS envoyé avec succès via AWS SNS'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('💥 Erreur dans send-sms:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Erreur interne du serveur',
        debug: {
          name: error.name,
          stack: error.stack
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);

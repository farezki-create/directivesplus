
import { generateConfirmationEmailTemplate, generatePasswordResetTemplate } from './emailTemplates.ts';
import type { EmailRequest } from './emailValidator.ts';

export interface SESResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
  details?: any;
  debug?: any;
}

interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

async function signAWSRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
  credentials: AWSCredentials
): Promise<Record<string, string>> {
  const encoder = new TextEncoder();
  
  // Create signature
  const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = date.substr(0, 8);
  
  const credentialScope = `${dateStamp}/${credentials.region}/ses/aws4_request`;
  const algorithm = 'AWS4-HMAC-SHA256';
  
  // Create canonical request
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
  
  // Create string to sign
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
  
  // Calculate signature
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
  const kService = await hmac(kRegion, 'ses');
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

export const sendEmailViaSES = async (emailRequest: EmailRequest, credentials: AWSCredentials): Promise<SESResponse> => {
  console.log('📤 Envoi de l\'email via AWS SES...');

  let htmlContent = '';
  let textContent = '';

  if (emailRequest.type === 'confirmation') {
    const templates = generateConfirmationEmailTemplate({
      confirmationUrl: emailRequest.confirmationUrl,
      userName: emailRequest.userName
    });
    htmlContent = templates.htmlContent;
    textContent = templates.textContent;
  } else if (emailRequest.type === 'password_reset') {
    const templates = generatePasswordResetTemplate({
      resetUrl: emailRequest.resetUrl
    });
    htmlContent = templates.htmlContent;
    textContent = templates.textContent;
  }

  try {
    const sesEndpoint = `https://email.${credentials.region}.amazonaws.com/`;
    
    const params = new URLSearchParams();
    params.append('Action', 'SendEmail');
    params.append('Version', '2010-12-01');
    params.append('Source', 'DirectivesPlus <noreply@directivesplus.fr>');
    params.append('Destination.ToAddresses.member.1', emailRequest.to);
    params.append('Message.Subject.Data', emailRequest.subject);
    params.append('Message.Subject.Charset', 'UTF-8');
    params.append('Message.Body.Html.Data', htmlContent);
    params.append('Message.Body.Html.Charset', 'UTF-8');
    params.append('Message.Body.Text.Data', textContent);
    params.append('Message.Body.Text.Charset', 'UTF-8');
    
    const body = params.toString();
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': `email.${credentials.region}.amazonaws.com`
    };
    
    const signedHeaders = await signAWSRequest('POST', sesEndpoint, headers, body, credentials);
    
    const response = await fetch(sesEndpoint, {
      method: 'POST',
      headers: signedHeaders,
      body: body
    });

    const responseText = await response.text();
    
    console.log('📨 Réponse SES:', {
      status: response.status,
      ok: response.ok,
      data: responseText
    });

    if (!response.ok) {
      console.error('❌ Erreur SES:', responseText);
      
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      if (responseText.includes('MessageRejected')) {
        errorMessage = 'Email rejeté par SES';
      } else if (responseText.includes('InvalidEmail')) {
        errorMessage = 'Adresse email invalide';
      } else if (responseText.includes('UnauthorizedAccess')) {
        errorMessage = 'Accès non autorisé à SES';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: responseText,
        debug: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        }
      };
    }

    // Extract MessageId from XML response
    const messageIdMatch = responseText.match(/<MessageId>(.+?)<\/MessageId>/);
    const messageId = messageIdMatch ? messageIdMatch[1] : 'unknown';

    console.log('✅ Email envoyé avec succès:', messageId);

    return {
      success: true,
      messageId: messageId,
      message: 'Email envoyé avec succès via AWS SES'
    };

  } catch (error: any) {
    console.error('💥 Erreur lors de l\'envoi via SES:', error);
    
    return {
      success: false,
      message: error.message || 'Erreur interne lors de l\'envoi',
      error: error.message,
      debug: {
        name: error.name,
        stack: error.stack
      }
    };
  }
};

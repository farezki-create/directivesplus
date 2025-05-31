
import { generateConfirmationEmailTemplate, generatePasswordResetTemplate } from './emailTemplates.ts';
import type { EmailRequest } from './emailValidator.ts';

export interface ResendResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
  details?: any;
  debug?: any;
}

export const sendEmailViaResend = async (emailRequest: EmailRequest, resendApiKey: string): Promise<ResendResponse> => {
  console.log('📤 Envoi de l\'email via Resend...');

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
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DirectivesPlus <onboarding@resend.dev>',
        to: [emailRequest.to],
        subject: emailRequest.subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    const responseData = await response.json();
    
    console.log('📨 Réponse Resend:', {
      status: response.status,
      ok: response.ok,
      data: responseData
    });

    if (!response.ok) {
      console.error('❌ Erreur Resend:', responseData);
      
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      if (responseData.message?.includes('You can only send testing emails')) {
        errorMessage = 'Configuration Resend : domaine non vérifié. Utilisation de l\'adresse de test.';
      } else if (responseData.message?.includes('Invalid email')) {
        errorMessage = 'Adresse email invalide';
      } else if (responseData.message?.includes('API key')) {
        errorMessage = 'Clé API Resend invalide';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: responseData.message,
        details: responseData,
        debug: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        }
      };
    }

    console.log('✅ Email envoyé avec succès:', responseData);

    return {
      success: true,
      messageId: responseData.id,
      message: 'Email envoyé avec succès'
    };

  } catch (error: any) {
    console.error('💥 Erreur lors de l\'envoi via Resend:', error);
    
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

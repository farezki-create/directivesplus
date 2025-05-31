
export interface EmailRequest {
  to: string;
  subject: string;
  type: 'confirmation' | 'password_reset';
  confirmationUrl?: string;
  resetUrl?: string;
  userName?: string;
}

export const validateEmailRequest = (data: any): { isValid: boolean; error?: string; emailRequest?: EmailRequest } => {
  const { to, subject, type, confirmationUrl, resetUrl, userName } = data;

  if (!to || !subject || !type) {
    console.error('❌ Paramètres requis manquants:', { to: !!to, subject: !!subject, type: !!type });
    return {
      isValid: false,
      error: 'Paramètres requis manquants'
    };
  }

  if (type !== 'confirmation' && type !== 'password_reset') {
    return {
      isValid: false,
      error: 'Type d\'email invalide'
    };
  }

  if (type === 'confirmation' && !confirmationUrl) {
    return {
      isValid: false,
      error: 'URL de confirmation requise pour les emails de confirmation'
    };
  }

  if (type === 'password_reset' && !resetUrl) {
    return {
      isValid: false,
      error: 'URL de reset requise pour les emails de réinitialisation'
    };
  }

  return {
    isValid: true,
    emailRequest: { to, subject, type, confirmationUrl, resetUrl, userName }
  };
};

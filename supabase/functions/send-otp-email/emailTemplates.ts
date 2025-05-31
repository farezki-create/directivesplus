
export interface EmailTemplateData {
  confirmationUrl?: string;
  resetUrl?: string;
  userName?: string;
}

export const generateConfirmationEmailTemplate = (data: EmailTemplateData) => {
  const { confirmationUrl, userName } = data;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmez votre compte DirectivesPlus</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Bienvenue sur DirectivesPlus !</h1>
        <p>Bonjour ${userName || ''},</p>
        <p>Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirmer mon compte
          </a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
        <p>Ce lien expirera dans 24 heures.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
        </p>
      </div>
    </body>
    </html>
  `;
  
  const textContent = `
    Bienvenue sur DirectivesPlus !
    
    Bonjour ${userName || ''},
    
    Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte, veuillez cliquer sur ce lien :
    
    ${confirmationUrl}
    
    Ce lien expirera dans 24 heures.
    
    Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
  `;

  return { htmlContent, textContent };
};

export const generatePasswordResetTemplate = (data: EmailTemplateData) => {
  const { resetUrl } = data;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Réinitialisation de mot de passe - DirectivesPlus</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Réinitialisation de mot de passe</h1>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe DirectivesPlus. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>Ce lien expirera dans 1 heure.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
        </p>
      </div>
    </body>
    </html>
  `;
  
  const textContent = `
    Réinitialisation de mot de passe - DirectivesPlus
    
    Bonjour,
    
    Vous avez demandé la réinitialisation de votre mot de passe DirectivesPlus. Cliquez sur ce lien pour créer un nouveau mot de passe :
    
    ${resetUrl}
    
    Ce lien expirera dans 1 heure.
    
    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
  `;

  return { htmlContent, textContent };
};

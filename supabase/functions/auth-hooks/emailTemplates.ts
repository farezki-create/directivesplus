
interface EmailTemplate {
  subject: string;
  html: string;
}

interface TemplateData {
  actionUrl: string;
}

export const getEmailTemplate = (type: 'confirmation' | 'recovery' | 'magic_link', data: TemplateData): EmailTemplate => {
  const { actionUrl } = data;

  const templates = {
    confirmation: {
      subject: "Confirmez votre inscription - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Bienvenue sur DirectivesPlus !</h1>
          <p>Bonjour,</p>
          <p>Merci de vous être inscrit sur DirectivesPlus. Pour finaliser votre inscription et sécuriser votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Confirmer mon email
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p>Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    },
    recovery: {
      subject: "Réinitialisation de votre mot de passe - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Réinitialisation de mot de passe</h1>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur DirectivesPlus. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p><strong>Important :</strong> Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    },
    magic_link: {
      subject: "Connexion magique - DirectivesPlus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Connexion magique</h1>
          <p>Bonjour,</p>
          <p>Cliquez sur le bouton ci-dessous pour vous connecter automatiquement à DirectivesPlus :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Se connecter maintenant
            </a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
            ${actionUrl}
          </p>
          <p><strong>Important :</strong> Ce lien expirera dans 24 heures pour des raisons de sécurité.</p>
          <p>Cordialement,<br>L'équipe DirectivesPlus</p>
        </div>
      `
    }
  };

  return templates[type];
};

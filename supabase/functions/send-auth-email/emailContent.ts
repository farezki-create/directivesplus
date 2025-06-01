
import type { EmailRequest } from './types.ts';

export const generateEmailContent = (
  requestData: EmailRequest,
  origin: string | null
): { htmlContent: string; subject: string } => {
  const { subject, type, token, to } = requestData;

  if (type === 'confirmation' && token) {
    const confirmUrl = `${origin}/auth/confirm?token=${token}&type=signup`;
    console.log(`🔗 Confirmation URL generated: ${confirmUrl}`);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">DirectivesPlus</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Plateforme de directives anticipées</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Confirmez votre inscription</h2>
          <p style="color: #4b5563; margin-bottom: 20px;">Bonjour,</p>
          <p style="color: #4b5563; margin-bottom: 30px;">
            Merci de vous être inscrit sur DirectivesPlus. Pour activer votre compte et accéder à votre espace personnel, 
            veuillez cliquer sur le bouton ci-dessous :
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${confirmUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              ✅ Confirmer mon compte
            </a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 30px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              <strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <p style="word-break: break-all; color: #2563eb; margin: 10px 0 0 0; font-size: 14px;">${confirmUrl}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Si vous n'avez pas créé de compte sur DirectivesPlus, vous pouvez ignorer cet email.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 DirectivesPlus - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    `;
    
    return {
      htmlContent,
      subject: "Confirmez votre inscription - DirectivesPlus"
    };
  }

  // Default email content
  console.log("📝 Using default email content");
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">DirectivesPlus</h1>
      <p>Un email vous a été envoyé depuis DirectivesPlus.</p>
      <p>Si vous avez des questions, contactez notre support.</p>
    </div>
  `;
  
  return {
    htmlContent,
    subject: subject || 'Email de DirectivesPlus'
  };
};

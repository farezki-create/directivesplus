
import { getEmailTemplate } from "./emailTemplates.ts";
import { sendEmailViaBrevo } from "./brevoService.ts";

interface AuthHookPayload {
  type: string;
  table: string;
  record: any;
  schema: string;
  old_record?: any;
}

export const handleAuthEvent = async (payload: AuthHookPayload) => {
  console.log("🎣 Auth Hook reçu:", payload);

  // Vérifier que c'est un événement d'auth pertinent
  if (payload.table !== 'users' || !payload.record) {
    console.log("Événement ignoré - pas un utilisateur");
    return {
      success: true,
      message: "Event ignored"
    };
  }

  const user = payload.record;
  console.log("Utilisateur:", {
    id: user.id,
    email: user.email,
    email_confirmed_at: user.email_confirmed_at,
    recovery_sent_at: user.recovery_sent_at
  });

  // Détecter le type d'email à envoyer
  let emailType: 'confirmation' | 'recovery' | 'magic_link' = 'confirmation';
  let actionUrl = '';

  if (payload.type === 'INSERT' && !user.email_confirmed_at) {
    // Nouvel utilisateur - email de confirmation
    emailType = 'confirmation';
    actionUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth/confirm?token=${user.confirmation_token || 'TOKEN_PLACEHOLDER'}`;
  } else if (user.recovery_sent_at && new Date(user.recovery_sent_at) > new Date(Date.now() - 60000)) {
    // Reset password récent - email de récupération
    emailType = 'recovery';
    actionUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth/reset-password?token=${user.recovery_token || 'TOKEN_PLACEHOLDER'}`;
  } else {
    console.log("Aucun email à envoyer pour cet événement");
    return {
      success: true,
      message: "No email needed"
    };
  }

  // Préparer les données email
  const template = getEmailTemplate(emailType, { actionUrl });
  const emailData = {
    recipient_email: user.email,
    subject: template.subject,
    html: template.html,
    type: emailType
  };

  // Envoyer via Brevo
  const emailResponse = await sendEmailViaBrevo(emailData);

  console.log("✅ Email envoyé avec succès:", emailResponse);

  return {
    success: true,
    message: `Email ${emailType} envoyé via Brevo`,
    email_response: emailResponse
  };
};

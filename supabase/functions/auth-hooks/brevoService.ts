
interface EmailData {
  recipient_email: string;
  subject: string;
  html: string;
  type: string;
}

export const sendEmailViaBrevo = async (emailData: EmailData) => {
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  const smtpSenderEmail = Deno.env.get("SMTP_SENDER_EMAIL") || "contact@directivesplus.fr";
  const smtpSenderName = Deno.env.get("SMTP_SENDER_NAME") || "DirectivesPlus";
  
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY manquant");
  }

  const brevoPayload = {
    sender: {
      name: smtpSenderName,
      email: smtpSenderEmail
    },
    to: [{
      email: emailData.recipient_email,
      name: "Utilisateur DirectivesPlus"
    }],
    subject: emailData.subject,
    htmlContent: emailData.html
  };

  console.log("Envoi via API REST Brevo...");
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey
    },
    body: JSON.stringify(brevoPayload)
  });

  const result = await response.json();
  
  console.log("Réponse Brevo:", {
    status: response.status,
    statusText: response.statusText,
    result
  });

  if (!response.ok) {
    throw new Error(`Erreur API Brevo: ${response.status} - ${JSON.stringify(result)}`);
  }

  return result;
};


import type { BrevoEmailData, SmtpConfig } from './types.ts';

export const getSmtpConfig = (): SmtpConfig => {
  console.log("🔍 Checking SMTP environment variables...");
  const smtpHost = Deno.env.get("SMTP_HOST") || "smtp-relay.brevo.com";
  const smtpPort = Deno.env.get("SMTP_PORT") || "587";
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");
  
  console.log("🔧 SMTP Config:", {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser ? `${smtpUser.substring(0, 5)}...` : "MISSING",
    password: smtpPassword ? "PROVIDED" : "MISSING"
  });
  
  return {
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    password: smtpPassword
  };
};

export const validateSmtpConfig = (config: SmtpConfig): void => {
  if (!config.user || !config.password) {
    console.error("❌ Paramètres SMTP manquants");
    throw new Error("Configuration SMTP incomplète");
  }
};

export const createBrevoEmailData = (
  to: string,
  subject: string,
  htmlContent: string,
  type: string
): BrevoEmailData => {
  return {
    sender: {
      name: "DirectivesPlus",
      email: "contact@directivesplus.fr"
    },
    to: [{
      email: to,
      name: to.split('@')[0]
    }],
    subject,
    htmlContent,
    textContent: htmlContent.replace(/<[^>]*>/g, ''),
    tags: [`auth-${type}`]
  };
};

export const sendEmailViaBrevo = async (
  emailData: BrevoEmailData,
  apiKey: string
): Promise<any> => {
  console.log("📤 Sending email via Brevo API...");
  console.log("🎯 Email payload:", {
    sender: emailData.sender,
    to: emailData.to,
    subject: emailData.subject,
    tags: emailData.tags
  });

  const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(emailData)
  });

  console.log("📡 Brevo API response status:", brevoResponse.status);
  const brevoResult = await brevoResponse.json();
  console.log("📨 Brevo API response:", brevoResult);

  if (!brevoResponse.ok) {
    console.error("❌ Erreur SMTP Brevo:", brevoResult);
    throw new Error(`Erreur lors de l'envoi de l'email SMTP: ${JSON.stringify(brevoResult)}`);
  }

  console.log("✅ Email SMTP envoyé avec succès:", brevoResult);
  return brevoResult;
};

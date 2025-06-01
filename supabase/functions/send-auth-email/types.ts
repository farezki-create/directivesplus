
export interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  type: 'confirmation' | 'recovery' | 'invite';
  token?: string;
}

export interface BrevoEmailData {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent: string;
  tags: string[];
}

export interface SmtpConfig {
  host: string;
  port: string;
  user: string | undefined;
  password: string | undefined;
}

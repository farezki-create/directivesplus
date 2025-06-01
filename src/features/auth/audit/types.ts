
export interface EmailAuditResult {
  smtpConfig: {
    configured: boolean;
    provider: string;
    issues: string[];
  };
  authSettings: {
    confirmEmail: boolean;
    siteUrl: string;
    redirectUrls: string[];
    emailTemplate: string;
    issues: string[];
  };
  rateLimits: {
    emailSendLimit: string;
    signupLimit: string;
    currentUsage: number;
    issues: string[];
  };
  clientConfig: {
    url: string;
    key: string;
    autoRefresh: boolean;
    persistSession: boolean;
    issues: string[];
  };
  testResults: {
    connectionTest: boolean;
    signupTest: boolean;
    emailTest: boolean;
    errors: string[];
  };
}

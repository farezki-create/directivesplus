
/**
 * Logs dossier security events
 * @param action Action performed
 * @param success Whether the action was successful
 */
export const logDossierSecurityEvent = (action: string, success: boolean) => {
  console.log(`Dossier security event: ${action}, success: ${success}`);
  // Here you could send this to an analytics service or log it server-side
};

/**
 * Default timeout for security sessions (5 minutes)
 */
export const DEFAULT_SECURITY_TIMEOUT_MS = 5 * 60 * 1000;

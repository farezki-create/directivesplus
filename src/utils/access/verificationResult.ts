
// Type définition for verification results
export interface VerificationResult {
  success: boolean;
  data?: any;
  message?: string;
  accessType?: string;
}

// Helper function for logging verification results
export const logVerificationResult = (
  success: boolean, 
  message: string, 
  data?: any
) => {
  // No-op in production - errors are handled by callers
};

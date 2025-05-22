
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
  if (success) {
    console.log("Vérification réussie:", data);
  } else {
    console.log("Échec de la vérification:", message);
  }
};

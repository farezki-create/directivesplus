
// Interface for the request body
export interface RequestBody {
  code_saisi: string;
  bruteForceIdentifier?: string;
  isAuthUserRequest?: boolean;
  userId?: string;
}

// Interface for standardized responses
export interface StandardResponse {
  success: boolean;
  error?: string;
  dossier?: {
    id: string;
    userId: string;
    isFullAccess: boolean;
    isDirectivesOnly: boolean;
    isMedicalOnly: boolean;
    profileData?: any;
    contenu?: any;
  };
}

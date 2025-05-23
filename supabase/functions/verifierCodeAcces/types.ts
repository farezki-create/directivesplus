
// Interface for the request body
export interface RequestBody {
  accessCode?: string;
  bruteForceIdentifier?: string;
  userId?: string;
  accessType?: string;
  patientName?: string;
  patientBirthDate?: string | Date;
}

// Interface for standardized responses
export interface StandardResponse {
  success: boolean;
  error?: string;
  dossier?: {
    id: string;
    userId?: string;
    isFullAccess: boolean;
    isDirectivesOnly: boolean;
    isMedicalOnly: boolean;
    profileData?: any;
    contenu?: any;
  };
}

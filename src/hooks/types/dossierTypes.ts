
/**
 * Dossier type definitions
 */

export interface Dossier {
  id: string;
  userId: string; // Changed from optional to required to match dossierStore.ts
  isFullAccess: boolean;
  isDirectivesOnly: boolean;
  isMedicalOnly: boolean;
  profileData?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    gender?: string;
  };
  contenu: {
    document_url?: string;
    documents?: any[];
    patient?: {
      nom: string;
      prenom: string;
      date_naissance: string | null;
    };
  };
}

export interface VerificationResult {
  success: boolean;
  dossier?: Dossier;
  error?: string;
}

export interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  [key: string]: any;
}

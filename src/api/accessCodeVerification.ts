
export interface VerificationResult {
  success: boolean;
  dossier?: any;
  error?: string;
}

export const getAuthUserDossier = async (userId: string, type: string): Promise<VerificationResult> => {
  try {
    // Simuler une vérification API
    return {
      success: true,
      dossier: {
        id: userId,
        userId: userId,
        contenu: { documents: [] },
        profileData: {
          first_name: "Utilisateur",
          last_name: "Connecté"
        }
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

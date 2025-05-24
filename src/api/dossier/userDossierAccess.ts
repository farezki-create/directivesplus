
export interface UserDossierResult {
  success: boolean;
  dossier?: any;
  error?: string;
}

export const getUserDossier = async (userId: string): Promise<UserDossierResult> => {
  try {
    // Simuler l'accès au dossier utilisateur
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


import { supabase } from "@/integrations/supabase/client";

export interface DossierResult {
  success: boolean;
  dossier?: any;
  error?: string;
}

export const getAuthUserDossier = async (userId: string, type: string): Promise<DossierResult> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      dossier: {
        id: data.id,
        userId: data.id,
        contenu: { documents: [] },
        profileData: {
          first_name: data.prenom,
          last_name: data.nom,
          birth_date: data.date_naissance
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

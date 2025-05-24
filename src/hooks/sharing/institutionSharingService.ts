
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "./types";

export interface InstitutionAccessResult {
  success: boolean;
  message: string;
  patientData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    directives: any[];
  };
}

export const generateInstitutionAccessCode = async (
  document: ShareableDocument,
  expiresInDays: number = 30
): Promise<string | null> => {
  if (!document.user_id) {
    throw new Error("Document must have a user_id to generate institution code");
  }

  // Calculer la date d'expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  // Déterminer le type de document
  const documentType = document.source || 
    (document.file_type === 'directive' ? 'directives' : 'pdf_documents');

  // Créer une entrée dans shared_documents avec un code d'accès institution
  const { data, error } = await supabase
    .from('shared_documents')
    .insert({
      user_id: document.user_id,
      document_id: document.id,
      document_type: documentType,
      document_data: {
        ...document,
        access_type: 'institution'
      },
      expires_at: expiresAt.toISOString(),
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur génération code institution:", error);
    throw error;
  }

  console.log("Code institution généré:", data.access_code);
  return data.access_code;
};

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  accessCode: string
): Promise<InstitutionAccessResult> => {
  try {
    console.log("=== VALIDATION ACCÈS INSTITUTION ===");
    console.log("Paramètres:", { lastName, firstName, birthDate, accessCode });

    // Utiliser la fonction RPC existante pour obtenir les documents partagés
    const { data, error } = await supabase.rpc(
      'get_shared_documents_by_access_code',
      {
        input_access_code: accessCode,
        input_first_name: firstName,
        input_last_name: lastName,
        input_birth_date: birthDate
      }
    );

    console.log("Résultat RPC:", { data, error });

    if (error) {
      console.error("Erreur RPC:", error);
      return {
        success: false,
        message: "Erreur lors de la vérification du code d'accès"
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Aucun document trouvé avec ces informations. Vérifiez le code d'accès et les informations personnelles."
      };
    }

    // Récupérer les informations du profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, birth_date')
      .eq('id', data[0].user_id)
      .single();

    if (profileError || !profileData) {
      console.error("Erreur profil:", profileError);
      return {
        success: false,
        message: "Impossible de récupérer les informations du patient"
      };
    }

    // Construire les données du patient
    const patientData = {
      user_id: data[0].user_id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      birth_date: profileData.birth_date,
      directives: data.map(doc => doc.document_data)
    };

    console.log("Données patient construites:", patientData);

    return {
      success: true,
      message: `Accès autorisé pour ${profileData.first_name} ${profileData.last_name}`,
      patientData
    };

  } catch (error) {
    console.error("Erreur validation accès institution:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation"
    };
  }
};

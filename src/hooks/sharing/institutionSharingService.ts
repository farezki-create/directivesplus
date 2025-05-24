
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
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error } = await supabase
      .from('shared_documents')
      .insert({
        user_id: document.user_id!,
        document_id: document.id,
        document_type: 'directives',
        document_data: document as any, // Cast to any to avoid Json type conflict
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select('access_code')
      .single();

    if (error) {
      console.error("Erreur génération code institution:", error);
      return null;
    }

    // Maintenir compatibilité avec l'ancien système
    if (document.source === 'directives') {
      await supabase
        .from('directives')
        .update({
          institution_code: data.access_code,
          institution_code_expires_at: expiresAt.toISOString()
        })
        .eq('id', document.id);
    }

    return data.access_code;
  } catch (error: any) {
    console.error("Erreur génération code institution:", error);
    return null;
  }
};

export const validateInstitutionAccess = async (
  lastName: string,
  firstName: string,
  birthDate: string,
  institutionCode: string
): Promise<InstitutionAccessResult> => {
  try {
    console.log("Validation accès institution:", { lastName, firstName, birthDate, institutionCode });

    const { data, error } = await supabase.rpc(
      'get_shared_documents_by_access_code',
      {
        input_access_code: institutionCode,
        input_first_name: firstName,
        input_last_name: lastName,
        input_birth_date: birthDate
      }
    );

    if (error) {
      console.error("Erreur RPC:", error);
      return {
        success: false,
        message: "Erreur lors de la validation"
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Code d'accès invalide ou informations incorrectes"
      };
    }

    const firstDoc = data[0];
    return {
      success: true,
      message: `Accès autorisé pour ${firstName} ${lastName}`,
      patientData: {
        user_id: firstDoc.user_id,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        directives: data.map(doc => doc.document_data)
      }
    };
  } catch (error: any) {
    console.error("Erreur validation institution:", error);
    return {
      success: false,
      message: "Erreur technique lors de la validation"
    };
  }
};

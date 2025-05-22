
import { supabase } from "@/integrations/supabase/client";
import { showErrorToast } from "@/api/utils/apiUtils";
import { retryWithBackoff } from "@/api/utils/apiUtils";

/**
 * Verifies a document access code with retry mechanism
 * @param accessCode Access code to verify
 * @param bruteForceIdentifier Identifier to use for anti-brute force
 */
export const verifyCodeWithRetries = async (accessCode: string, bruteForceIdentifier?: string) => {
  try {
    return await retryWithBackoff(async () => {
      if (!accessCode) {
        throw new Error("Code d'accès non fourni");
      }

      // Get the document associated with this code
      const { data, error } = await supabase
        .from('document_access_codes')
        .select('document_id, user_id, is_full_access, expires_at')
        .eq('access_code', accessCode)
        .single();

      if (error || !data) {
        throw new Error("Code d'accès invalide ou expiré");
      }

      // Check if the code has expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error("Ce code d'accès a expiré");
      }

      // Log access attempt
      await supabase.from('document_access_logs').insert({
        user_id: data.user_id,
        access_code_id: accessCode,
        nom_consultant: 'Accès partagé',
        prenom_consultant: 'Consultation',
        ip_address: 'N/A',
        user_agent: navigator.userAgent
      });

      return {
        success: true,
        data: {
          documentId: data.document_id,
          userId: data.user_id,
          isFullAccess: data.is_full_access
        }
      };
    });
  } catch (error: any) {
    console.error("Échec de vérification du code:", error);
    showErrorToast("Erreur de vérification", error.message || "Code d'accès invalide");
    return { success: false, error: error.message };
  }
};

/**
 * Gets document content by access code
 */
export const getDocumentByAccessCode = async (documentId: string) => {
  try {
    return await retryWithBackoff(async () => {
      if (!documentId) {
        throw new Error("ID de document non fourni");
      }

      // Get the document
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error || !data) {
        throw new Error("Document introuvable");
      }

      return {
        success: true,
        document: data
      };
    });
  } catch (error: any) {
    console.error("Échec de récupération du document:", error);
    showErrorToast("Erreur", error.message || "Impossible de récupérer le document");
    return { success: false, error: error.message };
  }
};

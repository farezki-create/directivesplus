
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ValidationRequest, ValidationResult } from "@/types/sharing";

/**
 * Service de validation des codes d'accès
 */
export class ValidationService {
  /**
   * Valide un code d'accès et retourne les documents
   */
  static async validateCode(request: ValidationRequest): Promise<ValidationResult> {
    try {
      console.log("ValidationService.validateCode - Début validation:", {
        accessCode: request.accessCode,
        hasPersonalInfo: !!request.personalInfo
      });

      const { data, error } = await supabase.rpc(
        'get_shared_documents_by_access_code',
        {
          input_access_code: request.accessCode,
          input_first_name: request.personalInfo?.firstName || null,
          input_last_name: request.personalInfo?.lastName || null,
          input_birth_date: request.personalInfo?.birthDate || null
        }
      );

      if (error) {
        console.error("Erreur RPC validation:", error);
        return {
          success: false,
          error: "Erreur lors de la vérification du code d'accès"
        };
      }

      if (!data || data.length === 0) {
        console.log("Aucune donnée retournée pour le code:", request.accessCode);
        return {
          success: false,
          error: "Code d'accès invalide ou expiré"
        };
      }

      console.log("Données brutes reçues:", data);

      // Extraire les documents de la première entrée (global_access)
      const firstEntry = data[0];
      const documentData = firstEntry.document_data;
      
      console.log("Document data structure:", documentData);

      // Vérifier si c'est un accès global avec des documents
      if (documentData?.access_type === 'global' && documentData?.documents) {
        const documents: ShareableDocument[] = documentData.documents.map((doc: any) => ({
          id: doc.id,
          file_name: doc.file_name || 'Document',
          file_path: doc.file_path || '',
          created_at: doc.created_at || firstEntry.shared_at,
          user_id: doc.user_id || firstEntry.user_id,
          file_type: doc.file_type || 'pdf',
          source: doc.source || 'pdf_documents',
          content: doc.content,
          description: doc.description,
          content_type: doc.content_type,
          is_private: doc.is_private || false,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at
        }));

        console.log(`Documents extraits: ${documents.length} documents trouvés`);
        console.log("Documents détails:", documents.map(d => ({ name: d.file_name, type: d.file_type })));

        return {
          success: true,
          documents,
          message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
        };
      } else {
        // Fallback pour l'ancien format de données
        console.log("Format de données non reconnu, tentative de récupération alternative");
        
        const documents: ShareableDocument[] = data.map((item: any) => {
          const docData = item.document_data;
          return {
            id: item.document_id,
            file_name: docData?.file_name || 'Document',
            file_path: docData?.file_path || '',
            created_at: docData?.created_at || item.shared_at,
            user_id: item.user_id,
            file_type: (docData?.file_type || 'pdf') as 'directive' | 'pdf' | 'medical',
            source: (docData?.source || item.document_type) as 'pdf_documents' | 'directives' | 'medical_documents',
            content: docData?.content,
            description: docData?.description,
            content_type: docData?.content_type,
            is_private: docData?.is_private,
            external_id: docData?.external_id,
            file_size: docData?.file_size,
            updated_at: docData?.updated_at
          };
        });

        return {
          success: true,
          documents,
          message: `Accès autorisé. ${documents.length} document(s) trouvé(s).`
        };
      }

    } catch (error: any) {
      console.error("Erreur ValidationService.validateCode:", error);
      return {
        success: false,
        error: "Erreur technique lors de la validation"
      };
    }
  }
}

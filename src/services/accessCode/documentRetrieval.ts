
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/accessCode";

/**
 * Service for retrieving user documents
 */
export class DocumentRetrievalService {
  /**
   * Récupère tous les documents d'un utilisateur
   */
  static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    console.log("📄 Récupération documents pour:", userId);
    
    const documents: ShareableDocument[] = [];

    try {
      // Directives
      const { data: directives } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId);

      if (directives) {
        directives.forEach(directive => {
          documents.push({
            id: directive.id,
            file_name: `Directive - ${new Date(directive.created_at).toLocaleDateString()}`,
            file_path: `directive-${directive.id}`,
            created_at: directive.created_at,
            user_id: directive.user_id,
            file_type: 'directive',
            source: 'directives',
            content: directive.content,
            description: 'Directive anticipée',
            content_type: 'application/json'
          });
        });
      }

      // Documents PDF
      const { data: pdfDocs } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      if (pdfDocs) {
        pdfDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'pdf',
            source: 'pdf_documents',
            description: doc.description || 'Document PDF',
            content_type: doc.content_type || 'application/pdf',
            external_id: doc.external_id,
            file_size: doc.file_size,
            updated_at: doc.updated_at
          });
        });
      }

      // Documents médicaux
      const { data: medicalDocs } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      if (medicalDocs) {
        medicalDocs.forEach(doc => {
          documents.push({
            id: doc.id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            created_at: doc.created_at,
            user_id: doc.user_id,
            file_type: 'medical',
            source: 'medical_documents',
            description: doc.description || 'Document médical',
            content_type: doc.file_type || 'application/pdf',
            file_size: doc.file_size
          });
        });
      }

      console.log("✅ Total documents récupérés:", documents.length);
      return documents;

    } catch (error) {
      console.error("💥 Erreur récupération documents:", error);
      return [];
    }
  }
}

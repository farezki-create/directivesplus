
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/sharing";

/**
 * Service de gestion des documents partagés
 */
export class DocumentService {
  /**
   * Récupère les documents d'un utilisateur
   */
  static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    try {
      // Récupérer les directives
      const { data: directives } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Récupérer les documents PDF
      const { data: pdfDocs } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const documents: ShareableDocument[] = [];

      // Transformer les directives
      if (directives) {
        documents.push(...directives.map(dir => ({
          id: dir.id,
          file_name: 'Directives anticipées',
          file_path: `directive://${dir.id}`,
          created_at: dir.created_at,
          user_id: dir.user_id,
          file_type: 'directive' as const,
          source: 'directives' as const,
          content: dir.content,
          description: 'Directives anticipées',
          content_type: 'application/json',
          is_private: false,
          external_id: null,
          file_size: null,
          updated_at: dir.updated_at
        })));
      }

      // Transformer les documents PDF
      if (pdfDocs) {
        documents.push(...pdfDocs.map(doc => ({
          id: doc.id,
          file_name: doc.file_name,
          file_path: doc.file_path,
          created_at: doc.created_at,
          user_id: doc.user_id || userId,
          file_type: 'pdf' as const,
          source: 'pdf_documents' as const,
          content: null,
          description: doc.description || 'Document PDF',
          content_type: doc.content_type || 'application/pdf',
          is_private: false,
          external_id: doc.external_id,
          file_size: doc.file_size,
          updated_at: doc.updated_at
        })));
      }

      return documents;
    } catch (error) {
      console.error("Erreur DocumentService.getUserDocuments:", error);
      return [];
    }
  }

  /**
   * Transforme un document pour le partage
   */
  static transformForSharing(document: any, userId: string): ShareableDocument {
    if (document.source === 'directives' || document.content) {
      return {
        id: document.id,
        file_name: document.file_name || 'Directives anticipées',
        file_path: `directive://${document.id}`,
        created_at: document.created_at,
        user_id: document.user_id || userId,
        file_type: 'directive',
        source: 'directives',
        content: document.content,
        description: document.description || 'Directives anticipées',
        content_type: 'application/json',
        is_private: document.is_private || false,
        external_id: document.external_id || null,
        file_size: document.file_size || null,
        updated_at: document.updated_at || document.created_at
      };
    }

    return {
      id: document.id,
      file_name: document.file_name || 'Document',
      file_path: document.file_path || '',
      created_at: document.created_at,
      user_id: document.user_id || userId,
      file_type: 'pdf',
      source: 'pdf_documents',
      content: document.content || null,
      description: document.description || 'Document',
      content_type: document.content_type || 'application/pdf',
      is_private: document.is_private || false,
      external_id: document.external_id || null,
      file_size: document.file_size || null,
      updated_at: document.updated_at || document.created_at
    };
  }
}

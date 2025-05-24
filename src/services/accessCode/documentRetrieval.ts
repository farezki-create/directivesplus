
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument } from "@/types/sharing";

/**
 * Service pour la récupération des documents utilisateur
 */
export class DocumentRetrievalService {
  /**
   * Récupère tous les documents d'un utilisateur
   */
  static async getUserDocuments(userId: string): Promise<ShareableDocument[]> {
    console.log("=== RÉCUPÉRATION DOCUMENTS UTILISATEUR ===");
    console.log("User ID:", userId);
    
    const documents: ShareableDocument[] = [];

    try {
      // Récupérer les directives
      console.log("🔍 Récupération des directives...");
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId);

      console.log("📄 Directives récupérées:", { count: directives?.length, error: directivesError });

      if (directivesError) {
        console.error("❌ Erreur directives:", directivesError);
      }

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
        console.log("✅ Directives ajoutées:", directives.length);
      }

      // Récupérer les documents PDF
      console.log("🔍 Récupération des documents PDF...");
      const { data: pdfDocs, error: pdfError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      console.log("📄 Documents PDF récupérés:", { count: pdfDocs?.length, error: pdfError });

      if (pdfError) {
        console.error("❌ Erreur PDF documents:", pdfError);
      }

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
        console.log("✅ Documents PDF ajoutés:", pdfDocs.length);
      }

      // Récupérer les documents médicaux
      console.log("🔍 Récupération des documents médicaux...");
      const { data: medicalDocs, error: medicalError } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', userId);

      console.log("📄 Documents médicaux récupérés:", { count: medicalDocs?.length, error: medicalError });

      if (medicalError) {
        console.error("❌ Erreur documents médicaux:", medicalError);
      }

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
        console.log("✅ Documents médicaux ajoutés:", medicalDocs.length);
      }

      console.log("=== TOTAL DOCUMENTS RÉCUPÉRÉS ===");
      console.log("Nombre total de documents:", documents.length);
      console.log("Détail par type:", {
        directives: documents.filter(d => d.source === 'directives').length,
        pdf: documents.filter(d => d.source === 'pdf_documents').length,
        medical: documents.filter(d => d.source === 'medical_documents').length
      });

      return documents;

    } catch (error) {
      console.error("💥 Erreur lors de la récupération des documents:", error);
      return [];
    }
  }
}

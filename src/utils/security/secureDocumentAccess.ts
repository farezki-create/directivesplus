
import { supabase } from "@/integrations/supabase/client";

interface SecureDocumentAccessResult {
  accessGranted: boolean;
  documentData?: {
    id: string;
    fileName: string;
    filePath: string;
    contentType: string;
  };
  errorMessage?: string;
}

export class SecureDocumentAccess {
  static async validateAccess(
    documentId: string,
    accessCode?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SecureDocumentAccessResult> {
    try {
      // Since validate_secure_document_access function doesn't exist,
      // implement the logic directly using existing tables
      
      // Check if user owns the document
      if (userId) {
        const { data: userDocument, error: userError } = await supabase
          .from('pdf_documents')
          .select('id, file_name, file_path, content_type')
          .eq('id', documentId)
          .eq('user_id', userId)
          .single();

        if (!userError && userDocument) {
          return {
            accessGranted: true,
            documentData: {
              id: userDocument.id,
              fileName: userDocument.file_name,
              filePath: userDocument.file_path,
              contentType: userDocument.content_type || 'application/pdf'
            }
          };
        }
      }

      // Check shared access if access code provided
      if (accessCode) {
        const { data: sharedDocument, error: sharedError } = await supabase
          .from('shared_documents')
          .select(`
            *,
            document_data
          `)
          .eq('document_id', documentId)
          .eq('access_code', accessCode)
          .eq('is_active', true)
          .single();

        if (!sharedError && sharedDocument) {
          // Check if not expired
          if (!sharedDocument.expires_at || new Date(sharedDocument.expires_at) > new Date()) {
            const documentData = sharedDocument.document_data as any;
            return {
              accessGranted: true,
              documentData: {
                id: documentData.id,
                fileName: documentData.file_name || documentData.fileName,
                filePath: documentData.file_path || documentData.filePath,
                contentType: documentData.content_type || documentData.contentType || 'application/pdf'
              }
            };
          }
        }
      }

      // Log failed access attempt
      await supabase.from('security_audit_logs').insert({
        event_type: 'unauthorized_document_access',
        ip_address: ipAddress,
        user_agent: userAgent,
        risk_level: 'high',
        details: {
          document_id: documentId,
          access_code_provided: !!accessCode,
          user_id: userId
        }
      });

      return {
        accessGranted: false,
        errorMessage: 'Access denied'
      };
    } catch (error) {
      console.error('Document access error:', error);
      return {
        accessGranted: false,
        errorMessage: 'Access validation error'
      };
    }
  }
}


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
      const { data, error } = await supabase.rpc('validate_secure_document_access', {
        p_document_id: documentId,
        p_access_code: accessCode,
        p_user_id: userId,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Document access validation failed:', error);
        return {
          accessGranted: false,
          errorMessage: 'Access validation failed'
        };
      }

      const result = data?.[0];
      if (!result) {
        return {
          accessGranted: false,
          errorMessage: 'No access result'
        };
      }

      if (!result.access_granted) {
        return {
          accessGranted: false,
          errorMessage: result.error_message || 'Access denied'
        };
      }

      return {
        accessGranted: true,
        documentData: {
          id: result.document_data.id,
          fileName: result.document_data.file_name,
          filePath: result.document_data.file_path,
          contentType: result.document_data.content_type
        }
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


import { supabase } from "@/integrations/supabase/client";

interface SecureDocumentAccessResult {
  accessGranted: boolean;
  documentData?: {
    id: string;
    fileName: string;
    filePath: string;
    contentType: string;
    fileSize?: number;
  };
  errorMessage?: string;
}

interface DocumentData {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  file_size?: number;
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
      // Use the new secure document access validation function
      const { data, error } = await supabase
        .rpc('validate_secure_document_access', {
          p_document_id: documentId,
          p_access_code: accessCode,
          p_user_id: userId,
          p_ip_address: ipAddress || '127.0.0.1',
          p_user_agent: userAgent || navigator.userAgent
        });

      if (error) {
        console.error('Document access validation error:', error);
        return {
          accessGranted: false,
          errorMessage: 'Access validation error'
        };
      }

      const result = data?.[0];
      if (!result) {
        return {
          accessGranted: false,
          errorMessage: 'Invalid response from server'
        };
      }

      if (result.access_granted && result.document_data) {
        // Type assertion for the document data from JSON - convert to unknown first
        const docData = result.document_data as unknown as DocumentData;
        return {
          accessGranted: true,
          documentData: {
            id: docData.id,
            fileName: docData.file_name,
            filePath: docData.file_path,
            contentType: docData.content_type || 'application/pdf',
            fileSize: docData.file_size
          }
        };
      } else {
        return {
          accessGranted: false,
          errorMessage: result.error_message || 'Access denied'
        };
      }
    } catch (error) {
      console.error('Document access error:', error);
      return {
        accessGranted: false,
        errorMessage: 'Access validation error'
      };
    }
  }
}

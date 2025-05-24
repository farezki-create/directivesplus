
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions, SharedDocument } from "./types";

export const createSharedDocument = async (
  document: ShareableDocument,
  options: ShareOptions = {}
): Promise<string | null> => {
  if (!document.user_id) {
    throw new Error("Document must have a user_id to be shared");
  }

  // Calculate expiration date
  let expiresAt = null;
  if (options.expiresInDays) {
    const date = new Date();
    date.setDate(date.getDate() + options.expiresInDays);
    expiresAt = date.toISOString();
  }

  // Determine document type
  const documentType = document.source || 
    (document.file_type === 'directive' ? 'directives' : 'pdf_documents');

  // Create entry in shared_documents with automatic code generation
  const { data, error } = await supabase
    .from('shared_documents')
    .insert({
      user_id: document.user_id,
      document_id: document.id,
      document_type: documentType,
      document_data: {
        id: document.id,
        file_name: document.file_name,
        file_path: document.file_path,
        created_at: document.created_at,
        description: document.description,
        content_type: document.content_type,
        file_type: document.file_type,
        content: document.content,
        source: document.source,
        is_private: document.is_private,
        external_id: document.external_id,
        file_size: document.file_size,
        updated_at: document.updated_at
      },
      expires_at: expiresAt,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data.access_code;
};

export const getSharedDocuments = async (): Promise<SharedDocument[]> => {
  const { data, error } = await supabase
    .from('shared_documents')
    .select('*')
    .eq('is_active', true)
    .order('shared_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getSharedDocumentsByAccessCode = async (
  accessCode: string,
  firstName?: string,
  lastName?: string,
  birthDate?: string
): Promise<any[]> => {
  const { data, error } = await supabase.rpc(
    'get_shared_documents_by_access_code',
    {
      input_access_code: accessCode,
      input_first_name: firstName || null,
      input_last_name: lastName || null,
      input_birth_date: birthDate || null
    }
  );

  if (error) {
    throw error;
  }

  return data || [];
};

export const deactivateSharedDocument = async (sharedDocumentId: string): Promise<void> => {
  const { error } = await supabase
    .from('shared_documents')
    .update({ is_active: false })
    .eq('id', sharedDocumentId);

  if (error) {
    throw error;
  }
};

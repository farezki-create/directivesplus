
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions, SharedDocument } from "../types";

export const createSharedDocument = async (
  document: ShareableDocument,
  options: ShareOptions = {}
): Promise<string | null> => {
  if (!document.user_id) {
    throw new Error("Document must have a user_id to be shared");
  }

  // Calculate expiration date - default to 1 year if not specified
  const expiryDays = options.expiresInDays || 365;
  const date = new Date();
  date.setDate(date.getDate() + expiryDays);
  const expiresAt = date.toISOString();

  // Determine document type - must match the check constraint
  let documentType = 'directives'; // Default value
  if (document.source === 'pdf_documents' || document.file_type === 'pdf') {
    documentType = 'pdf_documents';
  } else if (document.source === 'directives' || document.file_type === 'directive') {
    documentType = 'directives';
  }

  console.log("Création document partagé:", {
    user_id: document.user_id,
    document_id: document.id,
    document_type: documentType,
    expires_at: expiresAt
  });

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
        file_path: document.file_path || "",
        created_at: document.created_at,
        description: document.description,
        content_type: document.content_type,
        file_type: document.file_type,
        content: document.content,
        source: document.source,
        is_private: document.is_private,
        external_id: document.external_id,
        file_size: document.file_size,
        updated_at: document.updated_at,
        access_type: options.accessType || 'public'
      },
      expires_at: expiresAt,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur création document partagé:", error);
    throw error;
  }

  console.log("Document partagé créé avec succès:", data);
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

export const deactivateSharedDocument = async (sharedDocumentId: string): Promise<void> => {
  const { error } = await supabase
    .from('shared_documents')
    .update({ is_active: false })
    .eq('id', sharedDocumentId);

  if (error) {
    throw error;
  }
};

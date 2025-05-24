
import { supabase } from "@/integrations/supabase/client";
import type { ShareableDocument, ShareOptions, SharedDocument } from "./types";

export const createSharedDocument = async (
  document: ShareableDocument,
  options: ShareOptions = {}
): Promise<string | null> => {
  if (!document.user_id) {
    throw new Error("Document must have a user_id to be shared");
  }

  // Calculate expiration date - default to 1 year if not specified
  let expiresAt = null;
  const defaultExpiryDays = 365; // 1 an par défaut
  const expiryDays = options.expiresInDays || defaultExpiryDays;
  
  const date = new Date();
  date.setDate(date.getDate() + expiryDays);
  expiresAt = date.toISOString();

  // Determine document type
  const documentType = document.source || 
    (document.file_type === 'directive' ? 'directives' : 'pdf_documents');

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

export const extendSharedDocumentExpiry = async (
  accessCode: string,
  additionalDays: number = 365
): Promise<boolean> => {
  try {
    // Calculate new expiration date
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

    const { error } = await supabase
      .from('shared_documents')
      .update({ 
        expires_at: newExpiryDate.toISOString(),
        shared_at: new Date().toISOString() // Update shared_at to reflect the extension
      })
      .eq('access_code', accessCode)
      .eq('is_active', true);

    if (error) {
      console.error("Erreur prolongation code d'accès:", error);
      throw error;
    }

    console.log("Code d'accès prolongé avec succès jusqu'au:", newExpiryDate.toISOString());
    return true;
  } catch (error) {
    console.error("Erreur lors de la prolongation:", error);
    return false;
  }
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
  console.log("Recherche documents avec code:", { accessCode, firstName, lastName, birthDate });

  const { data, error } = await supabase.rpc(
    'get_shared_documents_by_access_code',
    {
      input_access_code: accessCode,
      input_first_name: firstName || null,
      input_last_name: lastName || null,
      input_birth_date: birthDate || null
    }
  );

  console.log("Résultat recherche documents:", { data, error });

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

export const regenerateAccessCode = async (
  currentAccessCode: string,
  expiresInDays: number = 365
): Promise<string | null> => {
  try {
    // First get the document info
    const { data: existingDoc, error: fetchError } = await supabase
      .from('shared_documents')
      .select('*')
      .eq('access_code', currentAccessCode)
      .eq('is_active', true)
      .single();

    if (fetchError || !existingDoc) {
      throw new Error("Document partagé introuvable");
    }

    // Deactivate the old code
    const { error: deactivateError } = await supabase
      .from('shared_documents')
      .update({ is_active: false })
      .eq('access_code', currentAccessCode);

    if (deactivateError) {
      throw deactivateError;
    }

    // Create new shared document with new code
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error } = await supabase
      .from('shared_documents')
      .insert({
        user_id: existingDoc.user_id,
        document_id: existingDoc.document_id,
        document_type: existingDoc.document_type,
        document_data: existingDoc.document_data,
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Erreur régénération code:", error);
      throw error;
    }

    return data.access_code;
  } catch (error) {
    console.error("Erreur lors de la régénération:", error);
    throw error;
  }
};

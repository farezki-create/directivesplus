
import { supabase } from "@/integrations/supabase/client";

export const extendSharedDocumentExpiry = async (
  accessCode: string,
  additionalDays: number = 365
): Promise<boolean> => {
  try {
    console.log("Extension code d'accès:", { accessCode, additionalDays });
    
    // Calculate new expiration date
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

    const { data, error } = await supabase
      .from('shared_documents')
      .update({ 
        expires_at: newExpiryDate.toISOString(),
        shared_at: new Date().toISOString() // Update shared_at to reflect the extension
      })
      .eq('access_code', accessCode)
      .eq('is_active', true)
      .select();

    if (error) {
      console.error("Erreur prolongation code d'accès:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.error("Aucun document trouvé avec ce code d'accès");
      return false;
    }

    console.log("Code d'accès prolongé avec succès jusqu'au:", newExpiryDate.toISOString());
    return true;
  } catch (error) {
    console.error("Erreur lors de la prolongation:", error);
    return false;
  }
};

export const regenerateAccessCode = async (
  currentAccessCode: string,
  expiresInDays: number = 365
): Promise<string | null> => {
  try {
    console.log("Régénération code d'accès:", { currentAccessCode, expiresInDays });
    
    // First get the document info
    const { data: existingDoc, error: fetchError } = await supabase
      .from('shared_documents')
      .select('*')
      .eq('access_code', currentAccessCode)
      .eq('is_active', true)
      .single();

    if (fetchError || !existingDoc) {
      console.error("Document partagé introuvable:", fetchError);
      throw new Error("Document partagé introuvable");
    }

    // Deactivate the old code
    const { error: deactivateError } = await supabase
      .from('shared_documents')
      .update({ is_active: false })
      .eq('access_code', currentAccessCode);

    if (deactivateError) {
      console.error("Erreur désactivation ancien code:", deactivateError);
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

    console.log("Nouveau code d'accès généré:", data.access_code);
    return data.access_code;
  } catch (error) {
    console.error("Erreur lors de la régénération:", error);
    throw error;
  }
};

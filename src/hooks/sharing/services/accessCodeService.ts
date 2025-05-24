
import { supabase } from "@/integrations/supabase/client";

export const extendSharedDocumentExpiry = async (
  accessCode: string,
  additionalDays: number = 365
): Promise<boolean> => {
  try {
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

    const { data, error } = await supabase
      .from('shared_documents')
      .update({ 
        expires_at: newExpiryDate.toISOString(),
        shared_at: new Date().toISOString()
      })
      .eq('access_code', accessCode)
      .eq('is_active', true)
      .select('access_code')
      .single();

    if (error || !data) {
      console.error("Erreur prolongation:", error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Erreur prolongation:", error);
    return false;
  }
};

export const regenerateAccessCode = async (
  currentCode: string,
  expiresInDays: number = 365
): Promise<string | null> => {
  try {
    // Récupérer le document existant
    const { data: existingDoc, error: fetchError } = await supabase
      .from('shared_documents')
      .select('*')
      .eq('access_code', currentCode)
      .eq('is_active', true)
      .single();

    if (fetchError || !existingDoc) {
      console.error("Document partagé introuvable:", fetchError);
      return null;
    }

    // Désactiver l'ancien code
    await supabase
      .from('shared_documents')
      .update({ is_active: false })
      .eq('access_code', currentCode);

    // Créer un nouveau partage
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
      .select('access_code')
      .single();

    if (error) {
      console.error("Erreur régénération:", error);
      return null;
    }

    return data.access_code;
  } catch (error: any) {
    console.error("Erreur régénération:", error);
    return null;
  }
};

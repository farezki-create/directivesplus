
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

/**
 * Shares a document by generating an access code
 * @param documentId ID of the document to share
 * @param expiresInDays Number of days until expiration (optional)
 * @returns Information about the shared document
 */
export const shareDocument = async (documentId: string, expiresInDays?: number) => {
  try {
    console.log(`Partage du document: ${documentId}`);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Vérifier que le document appartient à l'utilisateur
    const { data: document, error: docError } = await supabase
      .from('medical_documents')
      .select('id, user_id')
      .eq('id', documentId)
      .single();
    
    if (docError || !document || document.user_id !== user.id) {
      throw new Error("Document introuvable ou vous n'êtes pas autorisé à le partager");
    }
    
    // Generate a random access code
    const accessCode = uuidv4().substring(0, 8).toUpperCase();
    
    // Calculate expiration date if needed
    let expiresAt = null;
    if (expiresInDays) {
      const date = new Date();
      date.setDate(date.getDate() + expiresInDays);
      expiresAt = date.toISOString();
    }
    
    // Create an access code entry
    const { error: insertError } = await supabase
      .from('document_access_codes')
      .insert({
        user_id: user.id,
        document_id: documentId,
        access_code: accessCode,
        expires_at: expiresAt,
        is_full_access: true
      });
    
    if (insertError) {
      throw new Error("Erreur lors de la création du code d'accès");
    }
    
    toast({
      title: "Document partagé",
      description: "Code d'accès généré avec succès"
    });
    
    return {
      success: true,
      accessCode,
      documentId,
      expiresAt
    };
  } catch (error: any) {
    console.error("Erreur lors du partage du document:", error);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: error.message || "Impossible de partager le document"
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};


import { supabase } from "@/integrations/supabase/client";

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface DirectiveRecord {
  id: string;
  user_id: string;
  content: {
    documents: DirectiveDocument[];
  };
  created_at: string;
}

export const retrieveUserDocuments = async (userId: string, directiveId: string): Promise<DirectiveRecord> => {
  console.log("=== PROFILE MATCH FOUND! ===");
  
  // Récupérer TOUS les documents PDF pour cet utilisateur
  const { data: documentsData, error: documentsError } = await supabase
    .from('pdf_documents')
    .select('id, file_name, file_path, created_at, description, content_type, user_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (documentsError) {
    console.error("Error fetching documents:", documentsError);
    throw new Error("Erreur lors de la récupération des documents");
  }

  console.log("PDF Documents found:", documentsData?.length || 0);
  if (documentsData && documentsData.length > 0) {
    console.log("Documents details:", documentsData);
  }

  // Retourner les documents dans le format attendu par DirectivesDisplay
  const directiveRecord: DirectiveRecord = {
    id: directiveId,
    user_id: userId,
    content: {
      documents: documentsData || []
    },
    created_at: documentsData && documentsData.length > 0 ? documentsData[0].created_at : new Date().toISOString()
  };

  console.log("=== RETURNING DIRECTIVE RECORD ===");
  console.log("Directive record:", directiveRecord);
  
  return directiveRecord;
};

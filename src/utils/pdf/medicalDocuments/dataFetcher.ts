
import { MedicalDocument } from "./types";

/**
 * Récupère les documents médicaux depuis medical_documents uniquement
 */
export const getMedicalDocuments = async (userId: string): Promise<MedicalDocument[]> => {
  console.log("getMedicalDocuments - début avec userId:", userId);
  
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    console.log("Récupération depuis medical_documents...");
    
    // Récupérer uniquement depuis medical_documents (système principal)
    const { data: medicalDocs, error: medicalError } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (medicalError) {
      console.error('Erreur lors de la récupération des documents médicaux:', medicalError);
      return [];
    }

    if (!medicalDocs || medicalDocs.length === 0) {
      console.log("Aucun document médical trouvé");
      return [];
    }

    console.log("Documents trouvés dans medical_documents:", medicalDocs.length);
    
    const medicalDocuments = medicalDocs.map(doc => ({
      id: doc.id,
      file_name: doc.file_name,
      description: doc.description || `Document médical: ${doc.file_name}`,
      created_at: doc.created_at,
      user_id: doc.user_id,
      content: doc.extracted_content || '', // Utiliser le contenu extrait
      file_type: doc.file_type,
      file_path: doc.file_path,
      extracted_content: doc.extracted_content
    }));
    
    console.log("Total des documents médicaux récupérés:", medicalDocuments.length);
    console.log("Documents avec contenu extrait:", medicalDocuments.filter(d => d.extracted_content).length);
    
    return medicalDocuments;

  } catch (error) {
    console.error('Erreur lors de la récupération des documents médicaux:', error);
    return [];
  }
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MedicalDocument {
  id: string;
  name: string;
  description: string;
  created_at: string;
  file_path?: string;
  file_type?: string;
}

export const useMedicalDocumentState = (userId?: string) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<MedicalDocument[]>([]);
  const [deletingDocuments, setDeletingDocuments] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Fetch medical documents from medical_documents table only (simplified)
  useEffect(() => {
    const fetchMedicalDocuments = async () => {
      if (!userId) return;
      
      try {
        console.log("Récupération des documents depuis medical_documents uniquement");
        
        // Fetch from medical_documents (new simplified system)
        const { data: medicalDocs, error: medicalError } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (medicalError) {
          console.error('Erreur lors de la récupération des documents médicaux:', medicalError);
          return;
        }

        if (medicalDocs && medicalDocs.length > 0) {
          const documents = medicalDocs.map(doc => ({
            id: doc.id,
            name: doc.file_name,
            description: doc.description || `Document médical: ${doc.file_name}`,
            created_at: doc.created_at,
            file_path: doc.file_path,
            file_type: doc.file_type
          }));
          
          console.log("Documents chargés:", documents.length);
          setUploadedDocuments(documents);
        } else {
          console.log("Aucun document trouvé");
          setUploadedDocuments([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents médicaux:', error);
        setUploadedDocuments([]);
      }
    };
    
    fetchMedicalDocuments();
  }, [userId]);

  return {
    uploadedDocuments,
    setUploadedDocuments,
    deletingDocuments,
    setDeletingDocuments,
    isProcessing,
    setIsProcessing
  };
};


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

  // Fetch medical documents from both medical_documents and questionnaires
  useEffect(() => {
    const fetchMedicalDocuments = async () => {
      if (!userId) return;
      
      try {
        // Fetch from medical_documents (new simplified system)
        const { data: medicalDocs, error: medicalError } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('user_id', userId);

        let allDocuments: MedicalDocument[] = [];

        if (!medicalError && medicalDocs) {
          allDocuments = medicalDocs.map(doc => ({
            id: doc.id,
            name: doc.file_name,
            description: doc.description || `Document médical: ${doc.file_name}`,
            created_at: doc.created_at,
            file_path: doc.file_path,
            file_type: doc.file_type
          }));
        }

        // Also fetch from questionnaire_responses (old system)
        const { data: questionnaireData, error: questionnaireError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('user_id', userId)
          .eq('questionnaire_type', 'medical-documents');
        
        if (!questionnaireError && questionnaireData) {
          const questionnaireDocuments = questionnaireData.map(item => ({
            id: item.question_id,
            name: item.question_text,
            description: item.response,
            created_at: item.created_at
          }));
          allDocuments = [...allDocuments, ...questionnaireDocuments];
        }

        setUploadedDocuments(allDocuments);
      } catch (error) {
        console.error('Erreur lors de la récupération des documents médicaux:', error);
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

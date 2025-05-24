
import { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { Document } from "@/types/documents";

export const useDossierDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dossierActif } = useDossierStore();

  useEffect(() => {
    const loadDocuments = () => {
      if (dossierActif?.contenu?.documents) {
        console.log("Documents du dossier:", dossierActif.contenu.documents);
        
        // Transform documents to match the Document interface
        const transformedDocuments: Document[] = dossierActif.contenu.documents.map((doc: any, index: number) => ({
          id: doc.id || `doc-${index}`,
          file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
          file_path: doc.file_path || doc.filePath || '',
          file_type: doc.file_type || doc.fileType || 'pdf',
          content_type: doc.content_type || doc.contentType,
          user_id: doc.user_id || doc.userId || '',
          created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
          description: doc.description,
          content: doc.content,
          file_size: doc.file_size || doc.fileSize,
          updated_at: doc.updated_at || doc.updatedAt,
          external_id: doc.external_id || doc.externalId
        }));
        
        setDocuments(transformedDocuments);
        console.log("Documents transformés:", transformedDocuments);
      } else {
        console.log("Aucun document dans le dossier actif");
        setDocuments([]);
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, [dossierActif]);

  return {
    documents,
    isLoading,
    setDocuments
  };
};

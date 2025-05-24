
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ShareableDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  content?: any;
  source?: 'pdf_documents' | 'directives' | 'medical_documents';
}

export const useDocumentSharing = () => {
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const shareDocument = async (document: ShareableDocument) => {
    if (!document.user_id) {
      toast({
        title: "Erreur",
        description: "Impossible de partager ce document",
        variant: "destructive"
      });
      return null;
    }

    setIsSharing(document.id);

    try {
      // Générer un code d'accès unique
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_unique_access_code');

      if (codeError) {
        throw codeError;
      }

      const accessCode = codeData;

      // Déterminer le type de document
      let documentType: string;
      if (document.source === 'directives' || document.file_type === 'directive') {
        documentType = 'directive';
      } else if (document.source === 'medical_documents') {
        documentType = 'medical_document';
      } else {
        documentType = 'pdf_document';
      }

      // Créer l'entrée dans shared_documents
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
            source: document.source
          },
          access_code: accessCode,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Document partagé",
        description: `Code d'accès généré : ${accessCode}`,
      });

      return accessCode;

    } catch (error) {
      console.error("Erreur lors du partage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager le document",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSharing(null);
    }
  };

  const getSharedDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('is_active', true)
        .order('shared_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des documents partagés:", error);
      return [];
    }
  };

  const stopSharing = async (sharedDocumentId: string) => {
    try {
      const { error } = await supabase
        .from('shared_documents')
        .update({ is_active: false })
        .eq('id', sharedDocumentId);

      if (error) {
        throw error;
      }

      toast({
        title: "Partage arrêté",
        description: "Le document n'est plus accessible via le code d'accès",
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de l'arrêt du partage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter le partage",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    shareDocument,
    getSharedDocuments,
    stopSharing,
    isSharing
  };
};

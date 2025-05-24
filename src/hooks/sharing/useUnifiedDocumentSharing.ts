
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
  is_private?: boolean;
  content?: any;
  external_id?: string | null;
  file_size?: number | null;
  updated_at?: string;
  source?: 'pdf_documents' | 'directives' | 'medical_documents';
}

export interface ShareOptions {
  expiresInDays?: number;
  accessType?: 'public' | 'institution' | 'medical';
  allowedAccesses?: number;
}

export const useUnifiedDocumentSharing = () => {
  const [isSharing, setIsSharing] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const shareDocument = async (
    document: ShareableDocument, 
    options: ShareOptions = {}
  ): Promise<string | null> => {
    if (!document.user_id) {
      toast({
        title: "Erreur",
        description: "Impossible de partager ce document",
        variant: "destructive"
      });
      return null;
    }

    setIsSharing(document.id);
    setShareError(null);

    try {
      // Générer un code d'accès unique
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_unique_access_code');

      if (codeError) {
        throw codeError;
      }

      const accessCode = codeData;

      // Calculer la date d'expiration
      let expiresAt = null;
      if (options.expiresInDays) {
        const date = new Date();
        date.setDate(date.getDate() + options.expiresInDays);
        expiresAt = date.toISOString();
      }

      // Déterminer le type de document
      const documentType = document.source || 
        (document.file_type === 'directive' ? 'directives' : 'pdf_documents');

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
            source: document.source,
            is_private: document.is_private,
            external_id: document.external_id,
            file_size: document.file_size,
            updated_at: document.updated_at
          },
          access_code: accessCode,
          expires_at: expiresAt,
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

    } catch (error: any) {
      console.error("Erreur lors du partage du document:", error);
      setShareError(error.message);
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

  const getSharedDocuments = async (): Promise<any[]> => {
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

  const stopSharing = async (sharedDocumentId: string): Promise<boolean> => {
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
    } catch (error: any) {
      console.error("Erreur lors de l'arrêt du partage:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter le partage",
        variant: "destructive"
      });
      return false;
    }
  };

  const generateInstitutionCode = async (
    document: ShareableDocument,
    expiresInDays: number = 30
  ): Promise<string | null> => {
    return shareDocument(document, { 
      expiresInDays, 
      accessType: 'institution' 
    });
  };

  return {
    shareDocument,
    generateInstitutionCode,
    getSharedDocuments,
    stopSharing,
    isSharing,
    shareError
  };
};

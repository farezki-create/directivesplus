
import { useOptimizedQuery, useFrequentQuery } from './useOptimizedQuery';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  description?: string;
  created_at: string;
  file_size?: number;
}

export const useDocuments = (userId?: string) => {
  const { handleError } = useErrorHandler({ component: 'useDocuments' });

  return useFrequentQuery(
    ['documents', userId],
    async (): Promise<Document[]> => {
      if (!userId) return [];
      
      try {
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        await handleError(error, 'fetchDocuments');
        throw error;
      }
    },
    {
      enabled: !!userId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: 2
    }
  );
};

export const useDocumentById = (documentId: string) => {
  const { handleError } = useErrorHandler({ component: 'useDocumentById' });

  return useOptimizedQuery(
    ['document', documentId],
    async (): Promise<Document | null> => {
      try {
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        await handleError(error, 'fetchDocument');
        throw error;
      }
    },
    {
      enabled: !!documentId,
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

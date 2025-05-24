
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ShareableDocument } from "@/hooks/sharing/types";

export const useSupabaseDocuments = () => {
  const [loading, setLoading] = useState(true);

  const fetchSupabaseDocuments = async (userId: string): Promise<ShareableDocument[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("useSupabaseDocuments - Documents récupérés depuis Supabase:", data);
      
      // Transform Supabase documents to match our ShareableDocument interface
      const supabaseDocuments: ShareableDocument[] = (data || []).map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        file_path: doc.file_path,
        created_at: doc.created_at,
        user_id: doc.user_id || userId,
        file_type: 'pdf' as const,
        source: 'pdf_documents' as const,
        description: doc.description || 'Document',
        content_type: doc.content_type || 'application/pdf',
        is_private: false,
        content: null,
        external_id: doc.external_id || null,
        file_size: doc.file_size || null,
        updated_at: doc.updated_at || doc.created_at
      }));
      
      return supabaseDocuments;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des documents Supabase:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSupabaseDocuments,
    loading
  };
};

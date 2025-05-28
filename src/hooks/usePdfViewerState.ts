
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useBrowserDetection } from "./useBrowserDetection";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentPrint } from "./useDocumentPrint";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  content?: any;
  user_id: string;
  created_at: string;
}

export const usePdfViewerState = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isExternalBrowser } = useBrowserDetection();
  const { handleDownload } = useDocumentDownload();
  const { handlePrint } = useDocumentPrint();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize search params to prevent unnecessary re-renders
  const searchParamsData = useMemo(() => ({
    documentId: searchParams.get('id'),
    documentType: searchParams.get('type') || 'pdf',
    accessType: searchParams.get('access'),
    userId: searchParams.get('user')
  }), [searchParams]);

  const { documentId, documentType, accessType, userId } = searchParamsData;

  console.log("PdfViewerState - Init with params:", {
    documentId,
    documentType,
    accessType,
    userId,
    isExternalBrowser
  });

  const loadDocument = useCallback(async () => {
    if (!documentId) {
      setError("ID de document manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("PdfViewerState - Loading document:", {
        documentId,
        documentType,
        accessType
      });

      let documentData = null;

      if (documentType === 'directive') {
        // Charger une directive
        const { data, error } = await supabase
          .from('directives')
          .select('*')
          .eq('id', documentId)
          .single();

        if (error) throw error;
        
        if (data) {
          documentData = {
            id: data.id,
            file_name: 'Directives Anticipées',
            file_path: `/directive-viewer/${data.id}`,
            file_type: 'application/json',
            content_type: 'application/json',
            content: data.content,
            user_id: data.user_id,
            created_at: data.created_at
          };
        }
      } else {
        // Charger un document PDF
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (error) throw error;
        
        if (data) {
          documentData = {
            ...data,
            file_type: data.content_type || 'application/pdf'
          };
        }
      }

      if (!documentData) {
        throw new Error("Document non trouvé");
      }

      setDocument(documentData);
      console.log("PdfViewerState - Document loaded:", documentData);
      
    } catch (err: any) {
      console.error("PdfViewerState - Error loading document:", err);
      setError(err.message || "Erreur lors du chargement du document");
      
      if (retryCount < 2) {
        toast({
          title: "Erreur de chargement",
          description: "Tentative de rechargement...",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [documentId, documentType, accessType, retryCount]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (document) {
      handleDownload(document.file_path, document.file_name);
    }
  }, [document, handleDownload]);

  const handlePrintPdf = useCallback(() => {
    if (document) {
      handlePrint(document.file_path, document.file_type);
    }
  }, [document, handlePrint]);

  const handleOpenExternal = useCallback(() => {
    if (document?.file_path) {
      window.open(document.file_path, '_blank');
    }
  }, [document]);

  const handleGoBack = useCallback(() => {
    if (accessType === 'card') {
      navigate('/mes-directives');
    } else {
      navigate(-1);
    }
  }, [accessType, navigate]);

  return {
    documentId,
    documentType,
    isExternalBrowser,
    document,
    loading,
    error,
    retryCount,
    handleRetry,
    handleDownloadPdf,
    handlePrintPdf,
    handleOpenExternal,
    handleGoBack,
    handleDownload
  };
};

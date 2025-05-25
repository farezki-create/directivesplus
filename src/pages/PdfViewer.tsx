
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PdfViewer = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        setError("ID du document manquant");
        setLoading(false);
        return;
      }

      try {
        console.log("PdfViewer - Chargement du document:", documentId);

        // Rechercher le document dans pdf_documents
        const { data: document, error: docError } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (docError) {
          console.error("Erreur lors de la récupération du document:", docError);
          setError("Document non trouvé");
          setLoading(false);
          return;
        }

        console.log("Document trouvé:", document);

        if (document.file_path) {
          // Rediriger vers le fichier PDF
          window.location.href = document.file_path;
        } else {
          setError("Chemin du fichier manquant");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement du document");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p>Redirection vers le document...</p>
      </div>
    </div>
  );
};

export default PdfViewer;

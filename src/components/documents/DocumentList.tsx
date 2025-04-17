import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { DocumentScanner } from "@/components/DocumentScanner";
import { Document } from "./types";
import { DocumentActions } from "./DocumentActions";
import { EmptyDocumentState } from "./EmptyDocumentState";
import { DocumentsList } from "./DocumentsList";

export function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sharingCode, setSharingCode] = useState<string | null>(null);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const { retrieveExternalDocument } = usePDFGeneration(userId);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos documents",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchDocuments();
    }
  }, [userId, toast]);

  const handlePreview = async (document: Document) => {
    setSelectedDocument(document);
    
    try {
      const documentId = document.external_id || document.file_name.replace('.pdf', '');
      const url = await retrieveExternalDocument(documentId);
      
      if (url) {
        setPreviewUrl(url);
        setShowPreview(true);
      } else {
        throw new Error("Impossible de récupérer le document");
      }
    } catch (error) {
      console.error("Error retrieving document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser ce document",
        variant: "destructive"
      });
    }
  };

  const handleAddMedicalDocument = () => {
    setShowDocumentScanner(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Vos documents médicaux</h2>
      
      <DocumentActions 
        onAddMedicalDocument={handleAddMedicalDocument}
      />
      
      {documents.length === 0 ? (
        <EmptyDocumentState />
      ) : (
        <DocumentsList 
          documents={documents} 
          onPreview={handlePreview}
          selectedDocumentId={selectedDocument?.id} 
          sharingCode={sharingCode}
        />
      )}
      
      {showPreview && previewUrl && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={previewUrl}
          externalDocumentId={selectedDocument?.external_id || ""}
        />
      )}

      <DocumentScanner 
        open={showDocumentScanner} 
        onClose={() => setShowDocumentScanner(false)}
      />
    </div>
  );
}

function navigate(path: string) {
  window.location.href = path;
}

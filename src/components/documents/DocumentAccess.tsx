
import { useState } from "react";
import { useDocumentAccess } from "@/hooks/useDocumentAccess";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentAccessForm } from "./access/DocumentAccessForm";
import { AccessedDocuments } from "./access/AccessedDocuments";
import { useDocumentPreview } from "@/hooks/useDocumentPreview";
import { useNavigate } from "react-router-dom";

interface DocumentAccessProps {
  userId: string;
}

export function DocumentAccess({ userId }: DocumentAccessProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isVerifying, verifyAccess } = useDocumentAccess();
  const [accessData, setAccessData] = useState<{
    isFullAccess: boolean;
    allowedDocumentId?: string;
  } | null>(null);
  const [documents, setDocuments] = useState([]);
  const {
    selectedDocumentId,
    previewUrl,
    isPreviewOpen,
    setIsPreviewOpen,
    handlePreviewDocument
  } = useDocumentPreview();

  const handleAccessDocument = async ({ 
    firstName, 
    lastName, 
    birthDate, 
    accessId 
  }: {
    firstName: string;
    lastName: string;
    birthDate: string;
    accessId: string;
  }) => {
    try {
      const accessResult = await verifyAccess(accessId, firstName, lastName, birthDate);
      
      if (!accessResult) {
        throw new Error("Accès refusé ou document non trouvé");
      }

      setAccessData({
        isFullAccess: accessResult.is_full_access,
        allowedDocumentId: accessResult.document_id
      });

      const { data: docs, error: docsError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      if (docsError) throw docsError;
      setDocuments(docs);
      
      // Show success toast
      toast({
        title: "Accès autorisé",
        description: accessResult.is_full_access 
          ? "Vous avez accès à tous les documents" 
          : "Vous avez accès au document spécifié"
      });

      // Navigate to /my-documents with the access data
      navigate("/my-documents", { 
        state: { 
          accessData: {
            isFullAccess: accessResult.is_full_access,
            allowedDocumentId: accessResult.document_id,
            documents: docs
          }
        } 
      });

    } catch (error: any) {
      console.error("Error accessing documents:", error);
      toast({
        title: "Erreur d'accès",
        description: error.message || "Impossible d'accéder aux documents",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Accéder à un document partagé</h2>
      
      <p className="text-gray-600">
        Utilisez ce formulaire pour accéder aux documents qui vous ont été partagés. 
        Vous devez fournir le code d'accès qui vous a été communiqué, ainsi que les 
        informations d'identité correspondant au document.
      </p>
      
      <DocumentAccessForm
        onSubmit={handleAccessDocument}
        isVerifying={isVerifying}
      />
      
      <AccessedDocuments
        documents={documents}
        selectedDocumentId={selectedDocumentId}
        previewUrl={previewUrl}
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        onPreview={handlePreviewDocument}
        accessData={accessData}
      />
    </div>
  );
}

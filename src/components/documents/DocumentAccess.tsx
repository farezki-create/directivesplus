
import { useState } from "react";
import { useDocumentAccess } from "@/hooks/useDocumentAccess";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentAccessForm } from "./access/DocumentAccessForm";
import { AccessedDocuments } from "./access/AccessedDocuments";
import { useDocumentPreview } from "@/hooks/useDocumentPreview";
import { useNavigate } from "react-router-dom";
import { PDFStorageService } from "@/utils/storage/PDFStorageService";

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
      console.log("Verifying access with:", { firstName, lastName, birthDate, accessId });
      const accessResult = await verifyAccess(accessId, firstName, lastName, birthDate);
      
      if (!accessResult) {
        throw new Error("Accès refusé ou document non trouvé");
      }

      console.log("Access result:", accessResult);
      setAccessData({
        isFullAccess: accessResult.is_full_access,
        allowedDocumentId: accessResult.document_id
      });

      // Fetch documents or get document from external service
      if (accessResult.document_id.startsWith('document_')) {
        // Handle Scalingo HDS case
        const documentUrl = await PDFStorageService.retrieveFromCloud(accessResult.document_id);
        
        if (documentUrl) {
          // Navigate to the documents page with the external document data
          navigate("/my-documents", { 
            state: { 
              accessData: {
                documentUrl,
                externalDocumentId: accessId
              }
            } 
          });
          return;
        }
      } else {
        // Handle Supabase case
        let docsQuery = supabase.from('pdf_documents').select('*');
        
        // If not full access, restrict to the specific document
        if (!accessResult.is_full_access && accessResult.document_id) {
          docsQuery = docsQuery.eq('id', accessResult.document_id);
        } else {
          docsQuery = docsQuery.eq('user_id', userId);
        }
        
        const { data: docs, error: docsError } = await docsQuery;

        if (docsError) {
          console.error("Error fetching documents:", docsError);
          throw docsError;
        }
        
        console.log("Retrieved documents:", docs);
        setDocuments(docs || []);
        
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
      }

      // Show success toast
      toast({
        title: "Accès autorisé",
        description: "Vous avez accès aux documents demandés"
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

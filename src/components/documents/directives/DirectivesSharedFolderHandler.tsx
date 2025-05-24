
import React, { useEffect } from "react";
import { useDocumentTransfer } from "@/hooks/useDocumentTransfer";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import TransferStatusDialog from "@/components/documents/TransferStatusDialog";

// Interface mise à jour pour inclure la propriété content
interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any; // Ajout de la propriété content
}

interface DirectivesSharedFolderHandlerProps {
  documents: Document[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  accessCode?: string | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

/**
 * Component that handles adding documents to the shared folder
 */
const DirectivesSharedFolderHandler: React.FC<DirectivesSharedFolderHandlerProps> = ({
  documents,
  onDownload,
  onPrint,
  onView,
  onDelete,
  accessCode,
  profile
}) => {
  const { transferDocument, transferStatus, isTransferring } = useDocumentTransfer();

  // Log when this component renders with its props
  useEffect(() => {
    console.log("DirectivesSharedFolderHandler rendered:", { 
      documentsCount: documents.length, 
      hasAccessCode: !!accessCode
    });
  }, [documents.length, accessCode]);

  const handleAddToSharedFolder = async (document: Document) => {
    console.log("Démarrage du transfert fiable pour le document:", document);
    await transferDocument(document);
  };

  return (
    <>
      <DirectivesDocumentList 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        onAddToSharedFolder={handleAddToSharedFolder}
        onVisibilityChange={(id, isPrivate) => {
          console.log("DirectivesPageContent - Changement de visibilité:", id, isPrivate);
        }}
        isAdding={isTransferring}
      />
      
      <TransferStatusDialog
        isOpen={isTransferring}
        onOpenChange={() => {}} // Empêcher la fermeture manuelle pendant le transfert
        status={transferStatus}
      />
    </>
  );
};

export default DirectivesSharedFolderHandler;

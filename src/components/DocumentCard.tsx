
import React, { useState } from "react";
import DocumentHeader from "@/components/documents/card/DocumentHeader";
import DocumentActions from "@/components/documents/card/DocumentActions";
import ShareDialog from "@/components/documents/card/ShareDialog";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  is_private?: boolean;
}

interface DocumentCardProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete,
  onVisibilityChange
}: DocumentCardProps) => {
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const handleVisibilityChange = (documentId: string, checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
    }
  };

  console.log("DocumentCard rendu avec document:", document);

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <DocumentHeader 
          document={document}
          isPrivate={isPrivate}
          onVisibilityChange={handleVisibilityChange}
        />
        
        <DocumentActions
          onView={() => {
            console.log("DocumentCard - onView appelé pour:", document.file_path);
            onView(document.file_path, document.file_type);
          }}
          onDownload={() => {
            console.log("DocumentCard - onDownload appelé:", document.file_path, document.file_name);
            onDownload(document.file_path, document.file_name);
          }}
          onPrint={() => {
            console.log("DocumentCard - onPrint appelé:", document.file_path, document.file_type);
            onPrint(document.file_path, document.file_type);
          }}
          onShare={() => {
            console.log("DocumentCard - onShare - Affichage du dialog de partage");
            setShowShareDialog(true);
          }}
          onDelete={() => {
            console.log("DocumentCard - onDelete appelé pour ID:", document.id);
            onDelete(document.id);
          }}
        />
      </div>

      <ShareDialog
        open={showShareDialog}
        documentId={document.id}
        onOpenChange={setShowShareDialog}
      />
    </div>
  );
};

export default DocumentCard;

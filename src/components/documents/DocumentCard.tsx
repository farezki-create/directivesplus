
import React, { useState } from "react";
import DocumentHeader from "./card/DocumentHeader";
import DocumentActions from "./card/DocumentActions";

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
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

const DocumentCard = ({
  document,
  onDownload,
  onView,
  onDelete,
  onVisibilityChange
}: DocumentCardProps) => {
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);
  
  const handleVisibilityChange = (documentId: string, checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
    }
  };

  const handleViewClick = () => {
    onView(document.file_path, document.file_type);
  };

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <DocumentHeader 
          document={document}
          isPrivate={isPrivate}
          onVisibilityChange={handleVisibilityChange}
        />
        
        <DocumentActions
          onView={handleViewClick}
          onDownload={() => onDownload(document.file_path, document.file_name)}
          onDelete={() => onDelete(document.id)}
        />
      </div>
    </div>
  );
};

export default DocumentCard;

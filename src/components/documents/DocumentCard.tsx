
import React, { useState } from "react";
import DocumentHeader from "@/components/documents/card/DocumentHeader";
import DocumentActions from "@/components/documents/card/DocumentActions";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  content_type?: string;
  is_private?: boolean;
}

interface DocumentCardProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  showPrint?: boolean;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  showPrint = true
}: DocumentCardProps) => {
  const [isPrivate, setIsPrivate] = useState(document.is_private || false);
  
  const handleVisibilityChange = (documentId: string, checked: boolean) => {
    setIsPrivate(checked);
    if (onVisibilityChange) {
      onVisibilityChange(documentId, checked);
    }
  };

  console.log("DocumentCard rendu avec document:", document);

  // Determine the correct file type to use
  const fileType = document.file_type || document.content_type || detectFileTypeFromPath(document.file_path);

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
            onView(document.file_path, fileType);
          }}
          onDownload={() => {
            console.log("DocumentCard - onDownload appelé:", document.file_path, document.file_name);
            onDownload(document.file_path, document.file_name);
          }}
          onPrint={() => {
            console.log("DocumentCard - onPrint appelé:", document.file_path, fileType);
            onPrint(document.file_path, fileType);
          }}
          onDelete={() => {
            console.log("DocumentCard - onDelete appelé pour ID:", document.id);
            onDelete(document.id);
          }}
          showPrint={showPrint}
        />
      </div>
    </div>
  );
};

// Helper function to detect file type from path
const detectFileTypeFromPath = (filePath: string): string => {
  if (!filePath) return "application/pdf"; // Default
  
  if (filePath.includes('image') || 
      filePath.endsWith('.jpg') || 
      filePath.endsWith('.jpeg') || 
      filePath.endsWith('.png') || 
      filePath.endsWith('.gif')) {
    return 'image/jpeg';
  } else if (filePath.includes('pdf') || filePath.endsWith('.pdf')) {
    return 'application/pdf';
  } else if (filePath.includes('audio') || 
             filePath.endsWith('.mp3') || 
             filePath.endsWith('.wav')) {
    return 'audio/mpeg';
  }
  return 'application/pdf'; // Default
};

export default DocumentCard;

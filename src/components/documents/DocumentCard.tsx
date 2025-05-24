
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
  onAddToSharedFolder?: () => void;
  showPrint?: boolean;
  isAddingToShared?: boolean;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  onAddToSharedFolder,
  showPrint = true,
  isAddingToShared = false
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
  const fileType = getFileType(document);

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
          onAddToSharedFolder={onAddToSharedFolder}
          showPrint={showPrint}
          isAddingToShared={isAddingToShared}
        />
      </div>
    </div>
  );
};

// Enhanced helper function to detect file type
const getFileType = (document: Document): string => {
  // First, try to use the explicit file_type or content_type from the document
  if (document.file_type) {
    return document.file_type;
  }
  
  if (document.content_type) {
    return document.content_type;
  }
  
  // If file_path is base64 data, try to extract from the data URL
  if (document.file_path && document.file_path.startsWith('data:')) {
    const mimeMatch = document.file_path.match(/^data:([^;]+)/);
    if (mimeMatch) {
      return mimeMatch[1];
    }
  }
  
  // Fall back to detecting from file name
  return detectFileTypeFromPath(document.file_name || document.file_path);
};

// Helper function to detect file type from path or filename
const detectFileTypeFromPath = (filePath: string): string => {
  if (!filePath) return "application/pdf"; // Default
  
  const fileName = filePath.toLowerCase();
  
  if (fileName.includes('image') || 
      fileName.endsWith('.jpg') || 
      fileName.endsWith('.jpeg') || 
      fileName.endsWith('.png') || 
      fileName.endsWith('.gif')) {
    return 'image/jpeg';
  } else if (fileName.includes('pdf') || fileName.endsWith('.pdf')) {
    return 'application/pdf';
  } else if (fileName.includes('audio') || 
             fileName.endsWith('.mp3') || 
             fileName.endsWith('.wav')) {
    return 'audio/mpeg';
  }
  return 'application/pdf'; // Default
};

export default DocumentCard;

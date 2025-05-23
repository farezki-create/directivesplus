
import React from "react";
import { FileText, Image, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VisibilityToggle from "./VisibilityToggle";

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

interface DocumentHeaderProps {
  document: Document;
  isPrivate: boolean;
  onVisibilityChange: (documentId: string, isPrivate: boolean) => void;
}

const DocumentHeader = ({ document, isPrivate, onVisibilityChange }: DocumentHeaderProps) => {
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-5 w-5 text-blue-600" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-green-600" />;
    } else if (fileType.startsWith('audio/')) {
      return <Volume2 className="h-5 w-5 text-purple-600" />;
    } else {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFileTypeBadge = (fileType?: string) => {
    if (!fileType) return null;
    
    if (fileType.startsWith('image/')) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Image</Badge>;
    } else if (fileType.startsWith('audio/')) {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Audio</Badge>;
    } else if (fileType === 'application/pdf') {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">PDF</Badge>;
    }
    return null;
  };

  const fileType = document.file_type || document.content_type;

  return (
    <div className="flex-1">
      <div className="flex items-start gap-3">
        {getFileIcon(fileType)}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {document.file_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">
              {formatDate(document.created_at)}
            </span>
            {getFileTypeBadge(fileType)}
          </div>
          {document.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {document.description}
            </p>
          )}
        </div>
        <VisibilityToggle
          documentId={document.id}
          isPrivate={isPrivate}
          onVisibilityChange={onVisibilityChange}
        />
      </div>
    </div>
  );
};

export default DocumentHeader;

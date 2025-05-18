
import React from "react";
import { formatRelativeDate } from "@/utils/dateUtils";
import {
  FileText,
  Image,
  File
} from "lucide-react";
import VisibilityToggle from "./VisibilityToggle";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  is_private?: boolean;
}

interface DocumentHeaderProps {
  document: Document;
  isPrivate: boolean;
  onVisibilityChange: (documentId: string, isPrivate: boolean) => void;
}

function getDocumentIcon(contentType?: string) {
  if (!contentType) return <File />;
  if (contentType.includes("pdf")) return <FileText />;
  if (contentType.includes("image")) return <Image />;
  return <File />;
}

const DocumentHeader = ({ document, isPrivate, onVisibilityChange }: DocumentHeaderProps) => {
  const formattedDate = formatRelativeDate(document.created_at);
  const documentIcon = getDocumentIcon(document.file_type);

  return (
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
        {documentIcon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{document.file_name}</h3>
        <p className="text-sm text-gray-500">
          {document.description || "Document"} • {formattedDate}
        </p>
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

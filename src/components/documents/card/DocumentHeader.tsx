
import React from "react";
import { formatRelativeDate } from "@/utils/dateUtils";
import {
  FileText,
  Image,
  File,
  Lock,
  Unlock
} from "lucide-react";

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
  onVisibilityChange: (checked: boolean) => void;
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

// Internal component for the visibility toggle
const VisibilityToggle = ({ 
  documentId,
  isPrivate, 
  onVisibilityChange 
}: { 
  documentId: string;
  isPrivate: boolean; 
  onVisibilityChange: (checked: boolean) => void;
}) => {
  import { Switch } from "@/components/ui/switch";
  import { Label } from "@/components/ui/label";

  return (
    <div className="flex items-center mt-2 gap-3">
      <div className="flex items-center space-x-2">
        <Switch
          id={`visibility-${documentId}`}
          checked={isPrivate}
          onCheckedChange={onVisibilityChange}
        />
        <Label htmlFor={`visibility-${documentId}`} className="flex items-center gap-1 text-xs text-gray-600">
          {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
          {isPrivate ? "Document privé" : "Document visible avec code"}
        </Label>
      </div>
    </div>
  );
};

export default DocumentHeader;

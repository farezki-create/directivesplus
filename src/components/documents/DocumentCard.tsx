
import React from "react";
import { formatRelativeDate } from "@/utils/dateUtils";
import {
  Download,
  Printer,
  Share2,
  Eye,
  Trash,
  FileText,
  Image,
  File,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  is_private?: boolean;
}

interface DocumentCardProps {
  document: Document;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
}

function getDocumentIcon(contentType?: string) {
  if (!contentType) return <File />;
  if (contentType.includes("pdf")) return <FileText />;
  if (contentType.includes("image")) return <Image />;
  return <File />;
}

const DocumentCard = ({
  document,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete
}: DocumentCardProps) => {
  const formattedDate = formatRelativeDate(document.created_at);
  const documentIcon = getDocumentIcon(document.content_type);

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
            {documentIcon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{document.file_name}</h3>
            <p className="text-sm text-gray-500">
              {document.description || "Document"} • {formattedDate}
            </p>
            <div className="flex items-center mt-2 text-xs text-gray-600">
              {document.is_private ? (
                <span className="flex items-center gap-1">
                  <Lock size={14} />
                  Document privé
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Unlock size={14} />
                  Document visible avec code
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            onClick={() => onView(document.file_path, document.content_type)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Voir
          </Button>
          <Button
            onClick={() => onDownload(document.file_path, document.file_name)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Télécharger
          </Button>
          <Button
            onClick={() => onPrint(document.file_path, document.content_type)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Printer className="h-3 w-3 mr-1" />
            Imprimer
          </Button>
          <Button
            onClick={() => onShare(document.id)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Share2 className="h-3 w-3 mr-1" />
            Partager
          </Button>
          <Button
            onClick={() => onDelete(document.id)}
            size="sm"
            variant="outline"
            className="text-xs text-red-500 hover:text-red-700 hover:border-red-200"
          >
            <Trash className="h-3 w-3 mr-1" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

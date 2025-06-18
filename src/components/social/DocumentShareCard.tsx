
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { Document } from "@/types/documents";

interface DocumentShareCardProps {
  document: Document;
  onView?: (filePath: string) => void;
  onDownload?: (filePath: string, fileName: string) => void;
}

const DocumentShareCard = ({ document, onView, onDownload }: DocumentShareCardProps) => {
  const handleView = () => {
    if (onView) {
      onView(document.file_path);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document.file_path, document.file_name);
    }
  };

  return (
    <Card className="border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate mb-1">
              {document.file_name}
            </h4>
            {document.description && (
              <p className="text-sm text-gray-600 mb-2">{document.description}</p>
            )}
            <p className="text-xs text-gray-500">
              Partagé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Voir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentShareCard;

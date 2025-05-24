
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";

interface SharedDocumentData {
  file_name: string;
  file_path: string;
  content_type?: string;
  description?: string;
}

interface SharedDocument {
  document_id: string;
  document_type: string;
  document_data: SharedDocumentData;
  user_id: string;
  shared_at: string;
}

interface SharedDocumentCardProps {
  document: SharedDocument;
  onView: (filePath: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
}

export const SharedDocumentCard: React.FC<SharedDocumentCardProps> = ({
  document,
  onView,
  onDownload
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="text-xl">{document.document_data.file_name}</CardTitle>
            {document.document_data.description && (
              <p className="text-sm text-gray-600 mt-1">{document.document_data.description}</p>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Partagé le {new Date(document.shared_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-3">
          <Button
            onClick={() => onView(document.document_data.file_path)}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            Voir le document
          </Button>

          <Button
            variant="outline"
            onClick={() => onDownload(document.document_data.file_path, document.document_data.file_name)}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Télécharger
          </Button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-900 mb-2">⚠️ Mode Debug</h3>
          <p className="text-sm text-yellow-800">
            Toutes les vérifications de sécurité ont été désactivées pour ce test.
            Le document est accessible sans restrictions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

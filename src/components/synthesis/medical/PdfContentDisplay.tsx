
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText } from "lucide-react";

interface PdfContentDisplayProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    extracted_content?: string;
    created_at: string;
  };
  onRemove: (documentId: string) => void;
}

const PdfContentDisplay: React.FC<PdfContentDisplayProps> = ({ document, onRemove }) => {
  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium text-blue-900">
              {document.file_name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(document.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-600">
          Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white rounded-md border p-4 max-h-96 overflow-y-auto">
          {document.extracted_content ? (
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {document.extracted_content}
            </div>
          ) : (
            <div className="text-center py-8">
              <iframe 
                src={document.file_path}
                className="w-full h-64 border rounded"
                title={document.file_name}
              />
              <p className="text-xs text-gray-500 mt-2">
                Contenu du document affiché ci-dessus
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-green-600 mt-2 font-medium">
          ✅ Ce contenu sera intégré dans votre PDF de directives anticipées
        </p>
      </CardContent>
    </Card>
  );
};

export default PdfContentDisplay;

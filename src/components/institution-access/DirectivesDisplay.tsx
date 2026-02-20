
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DirectiveDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

interface DirectiveRecord {
  id: string;
  user_id: string;
  content: {
    documents: DirectiveDocument[];
  };
  created_at: string;
}

interface DirectivesDisplayProps {
  documents: DirectiveRecord[];
}

export const DirectivesDisplay: React.FC<DirectivesDisplayProps> = ({ documents }) => {
  if (documents.length === 0) {
    return null;
  }

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const formatFileSize = (filePath: string) => {
    return "PDF";
  };

  const allDocuments = documents.reduce((acc, record) => {
    if (record.content?.documents) {
      return [...acc, ...record.content.documents];
    }
    return acc;
  }, [] as DirectiveDocument[]);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-green-800">
          Documents trouvés ({allDocuments.length})
        </h3>
      </div>
      
      {allDocuments.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-amber-800">
              <FileText className="h-6 w-6" />
              <div>
                <p className="font-medium">Aucun document trouvé</p>
                <p className="text-sm">Ce patient n'a pas encore uploadé de documents PDF.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allDocuments.map((doc, index) => (
            <Card key={`${doc.id}-${index}`} className="border-green-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-base font-medium text-gray-900">
                        {doc.file_name}
                      </CardTitle>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {formatFileSize(doc.file_path)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {doc.content_type && (
                      <Badge variant="outline" className="text-xs">
                        {doc.content_type}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(doc.file_path)}
                      className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4" />
                      Consulter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc.file_path, doc.file_name)}
                      className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-600">
          <strong>Information :</strong> Cet accès a été journalisé pour des raisons de sécurité et de traçabilité. 
          Tous les documents affichés appartiennent au patient dont les informations ont été vérifiées.
        </p>
      </div>
    </div>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    documents?: DirectiveDocument[];
    [key: string]: any;
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

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-green-800 mb-4">
        Directives anticipées trouvées
      </h3>
      
      {documents.map((record) => {
        const docs = record.content.documents || [];
        
        return (
          <div key={record.id} className="space-y-3">
            {docs.map((doc) => (
              <Card key={doc.id} className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-green-600" />
                    {doc.file_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>Créé le: {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                      {doc.description && (
                        <p className="mt-1">{doc.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc.file_path)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.file_path, doc.file_name)}
                        className="flex items-center gap-1"
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
        );
      })}
    </div>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectivesContentProps {
  directives: any[];
}

const DirectivesContent: React.FC<DirectivesContentProps> = ({ directives }) => {
  console.log("DirectivesContent - Directives reçues:", directives);

  if (!directives || directives.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Aucune directive disponible
          </h3>
          <p className="text-amber-700">
            Ce patient n'a pas encore enregistré de directives anticipées.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Directives anticipées ({directives.length})
        </h2>
      </div>

      {directives.map((directive, index) => (
        <Card key={directive.id || index} className="border-blue-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <CardTitle className="text-base font-medium text-gray-900">
                    {directive.file_name || directive.title || `Directive ${index + 1}`}
                  </CardTitle>
                  {directive.description && (
                    <p className="text-sm text-gray-600 mt-1">{directive.description}</p>
                  )}
                </div>
              </div>
              {directive.type && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {directive.type}
                </span>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Informations sur le document */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {directive.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Créé le {new Date(directive.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {directive.file_size && (
                  <span>{Math.round(directive.file_size / 1024)} KB</span>
                )}
              </div>

              {/* Contenu ou actions */}
              {directive.file_path ? (
                // Document avec fichier
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(directive.file_path)}
                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                    Consulter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(directive.file_path, directive.file_name)}
                    className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              ) : directive.content ? (
                // Contenu texte
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {typeof directive.content === 'string' 
                      ? directive.content 
                      : JSON.stringify(directive.content, null, 2)
                    }
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">Contenu non disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Information de traçabilité */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">
            <strong>Information :</strong> Cette consultation a été enregistrée et tracée 
            conformément aux exigences réglementaires. Tous les accès aux directives 
            anticipées sont journalisés pour des raisons de sécurité et de conformité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectivesContent;

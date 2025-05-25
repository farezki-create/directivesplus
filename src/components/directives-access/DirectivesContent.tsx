
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User, Download, Eye, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectiveItem } from "@/types/directives";

interface DirectivesContentProps {
  directives: DirectiveItem[];
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

  const getDirectiveIcon = (item: DirectiveItem) => {
    return item.type === 'document' ? <FileIcon className="h-6 w-6 text-blue-600 flex-shrink-0" /> : <FileText className="h-6 w-6 text-green-600 flex-shrink-0" />;
  };

  const getDirectiveTitle = (item: DirectiveItem, index: number) => {
    if (item.type === 'document') {
      return item.file_name || `Document ${index + 1}`;
    }
    return `Directive anticipée ${index + 1}`;
  };

  const renderDirectiveContent = (item: DirectiveItem) => {
    if (item.type === 'document' && item.file_path) {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(item.file_path!)}
            className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
            Consulter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(item.file_path!, item.file_name!)}
            className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      );
    }

    if (item.type === 'directive' && item.content) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {typeof item.content === 'string' 
              ? item.content 
              : JSON.stringify(item.content, null, 2)
            }
          </div>
        </div>
      );
    }

    return <p className="text-gray-500 italic">Contenu non disponible</p>;
  };

  // Séparer les directives par type pour un affichage organisé
  const directivesByType = directives.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, DirectiveItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Directives anticipées ({directives.length})
        </h2>
      </div>

      {/* Affichage des directives textuelles */}
      {directivesByType.directive && directivesByType.directive.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Directives textuelles ({directivesByType.directive.length})
          </h3>
          {directivesByType.directive.map((item, index) => (
            <Card key={item.id} className="border-green-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getDirectiveIcon(item)}
                    <CardTitle className="text-base font-medium text-gray-900">
                      {getDirectiveTitle(item, index)}
                    </CardTitle>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Directive
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Créé le {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {renderDirectiveContent(item)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Affichage des documents */}
      {directivesByType.document && directivesByType.document.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-blue-600" />
            Documents ({directivesByType.document.length})
          </h3>
          {directivesByType.document.map((item, index) => (
            <Card key={item.id} className="border-blue-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getDirectiveIcon(item)}
                    <div>
                      <CardTitle className="text-base font-medium text-gray-900">
                        {getDirectiveTitle(item, index)}
                      </CardTitle>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Document
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Créé le {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {item.file_size && (
                      <span>{Math.round(item.file_size / 1024)} KB</span>
                    )}
                  </div>
                  {renderDirectiveContent(item)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

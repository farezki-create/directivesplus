
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Info } from "lucide-react";

interface DirectivesContentProps {
  directives: any[];
}

const DirectivesContent: React.FC<DirectivesContentProps> = ({ directives }) => {
  if (directives.length === 0) {
    return (
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Aucun document de directives anticipées trouvé pour ce patient.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Directives Anticipées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {directives.map((directive, index) => (
            <div key={directive.id || index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {directive.content?.title || directive.titre || `Document ${index + 1}`}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {directive.created_at ? new Date(directive.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </span>
              </div>
              
              {/* Affichage du contenu selon le type */}
              {directive.content && typeof directive.content === 'object' ? (
                <div className="text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {JSON.stringify(directive.content, null, 2)}
                  </pre>
                </div>
              ) : directive.contenu ? (
                <div className="text-sm text-gray-700">
                  {directive.contenu}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Contenu de la directive disponible
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectivesContent;

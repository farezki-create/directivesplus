
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface DirectiveDocument {
  id: string;
  user_id: string;
  content: any;
  created_at: string;
}

interface DirectivesDisplayProps {
  documents: DirectiveDocument[];
}

export const DirectivesDisplay = ({ documents }: DirectivesDisplayProps) => {
  if (documents.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          {documents.length} directive(s) trouvée(s) pour ce patient
        </AlertDescription>
      </Alert>
      
      <h3 className="text-lg font-medium">Directives trouvées</h3>
      {documents.map((doc) => (
        <div key={doc.id} className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Directive anticipée</h4>
            <span className="text-sm text-gray-500">
              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="bg-white p-3 rounded border max-h-60 overflow-y-auto">
            {doc.content && typeof doc.content === 'object' ? (
              <div className="space-y-2">
                {Object.entries(doc.content).map(([key, value]) => (
                  <div key={key}>
                    <strong className="capitalize">{key.replace('_', ' ')}:</strong>
                    <p className="text-sm ml-2">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">{String(doc.content)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


import { useEffect, useState } from "react";
import { useDossierStore } from "@/store/dossierStore";

interface DirectivePreviewProps {
  filePath: string;
}

const DirectivePreview = ({ filePath }: DirectivePreviewProps) => {
  const { dossierActif } = useDossierStore();
  const [directiveContent, setDirectiveContent] = useState<any>(null);

  useEffect(() => {
    // Find the directive document by ID (filePath is the directive ID)
    if (dossierActif?.contenu?.documents) {
      const directive = dossierActif.contenu.documents.find(
        (doc: any) => doc.id === filePath && doc.file_type === 'directive'
      );
      
      if (directive) {
        setDirectiveContent(directive.content);
      }
    }
  }, [filePath, dossierActif]);

  if (!directiveContent) {
    return (
      <div className="py-4 text-center">
        <p>Chargement de la directive...</p>
      </div>
    );
  }

  return (
    <div className="py-4 max-h-[70vh] overflow-y-auto">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">
          {directiveContent.titre || directiveContent.title || "Directive Anticipée"}
        </h2>
        
        {directiveContent.type && (
          <div className="mb-3 text-sm text-gray-600">
            <strong>Type:</strong> {directiveContent.type}
          </div>
        )}
        
        {directiveContent.date_creation && (
          <div className="mb-3 text-sm text-gray-600">
            <strong>Date de création:</strong> {new Date(directiveContent.date_creation).toLocaleDateString('fr-FR')}
          </div>
        )}
        
        <div className="mt-4 space-y-3">
          {directiveContent.contenu && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Contenu:</h3>
              <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">
                {directiveContent.contenu}
              </div>
            </div>
          )}
          
          {directiveContent.content && typeof directiveContent.content === 'string' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Contenu:</h3>
              <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">
                {directiveContent.content}
              </div>
            </div>
          )}
          
          {directiveContent.content && typeof directiveContent.content === 'object' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Informations détaillées:</h3>
              <div className="bg-gray-50 p-4 rounded border">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(directiveContent.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectivePreview;

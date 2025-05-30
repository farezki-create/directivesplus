
import { useEffect, useState } from "react";
import { useDirectivesStore } from "@/store/directivesStore";

interface DirectivePreviewProps {
  filePath: string;
}

const DirectivePreview = ({ filePath }: DirectivePreviewProps) => {
  const { currentDocument } = useDirectivesStore();
  const [directiveContent, setDirectiveContent] = useState<any>(null);

  useEffect(() => {
    if (currentDocument && currentDocument.file_path === filePath) {
      setDirectiveContent(currentDocument.content || {
        title: currentDocument.file_name,
        content: "Contenu de la directive non disponible"
      });
    }
  }, [filePath, currentDocument]);

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
        </div>
      </div>
    </div>
  );
};

export default DirectivePreview;


import React from "react";

interface DirectivesContentProps {
  directives: any[];
}

const DirectivesContent: React.FC<DirectivesContentProps> = ({ directives }) => {
  console.log("DirectivesContent - Rendu des directives:", directives);
  
  if (!directives || directives.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune directive disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {directives.map((directive, index) => {
        console.log("DirectivesContent - Rendu directive:", directive);
        
        return (
          <div key={directive.id || index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">
                {directive.file_name || directive.description || `Document ${index + 1}`}
              </h3>
              {directive.created_at && (
                <p className="text-sm text-gray-500 mt-1">
                  Créé le {new Date(directive.created_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            
            <div className="p-6">
              {/* Gérer les documents avec contenu JSON */}
              {directive.content_type === 'application/json' && directive.content ? (
                <div className="space-y-4">
                  {directive.content.title && (
                    <h4 className="text-lg font-semibold text-gray-800">
                      {directive.content.title}
                    </h4>
                  )}
                  {directive.content.content && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {directive.content.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : directive.content_type === 'application/pdf' && directive.file_path ? (
                /* Gérer les documents PDF */
                <div className="w-full h-96">
                  <iframe 
                    src={directive.file_path}
                    className="w-full h-full border rounded"
                    title={directive.file_name || "Document PDF"}
                  />
                </div>
              ) : (
                /* Fallback pour autres types */
                <div className="text-gray-600">
                  <p>Type de document : {directive.content_type || 'Non spécifié'}</p>
                  <p className="mt-2 text-sm">
                    {directive.description || 'Aucune description disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DirectivesContent;

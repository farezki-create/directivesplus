
import React from "react";

interface DirectivesContentProps {
  directives: any;
}

const DirectivesContent: React.FC<DirectivesContentProps> = ({ directives }) => {
  console.log("DirectivesContent - Données reçues:", directives);
  console.log("DirectivesContent - Type des données:", typeof directives);
  console.log("DirectivesContent - Est un tableau:", Array.isArray(directives));
  
  // Normaliser les données - gérer différents formats possibles
  let normalizedDirectives = [];
  
  if (!directives) {
    console.log("DirectivesContent - Aucune donnée fournie");
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune directive disponible</p>
      </div>
    );
  }
  
  // Si c'est déjà un tableau, l'utiliser directement
  if (Array.isArray(directives)) {
    normalizedDirectives = directives;
  }
  // Si c'est un objet unique, le mettre dans un tableau
  else if (typeof directives === 'object') {
    normalizedDirectives = [directives];
  }
  // Si c'est une chaîne, créer un objet simple
  else if (typeof directives === 'string') {
    normalizedDirectives = [{
      id: 'string-directive',
      content: directives,
      content_type: 'text/plain'
    }];
  }
  
  console.log("DirectivesContent - Données normalisées:", normalizedDirectives);
  
  if (normalizedDirectives.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune directive disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {normalizedDirectives.map((directive, index) => {
        console.log("DirectivesContent - Rendu directive:", directive);
        
        const directiveId = directive.id || `directive-${index}`;
        const fileName = directive.file_name || directive.title || directive.name || `Document ${index + 1}`;
        const createdAt = directive.created_at || directive.date_creation;
        
        return (
          <div key={directiveId} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="font-medium text-gray-900">
                {fileName}
              </h3>
              {createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Créé le {new Date(createdAt).toLocaleDateString('fr-FR')}
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
                    title={fileName}
                  />
                </div>
              ) : directive.content_type === 'text/plain' && directive.content ? (
                /* Gérer le contenu texte simple */
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {directive.content}
                  </p>
                </div>
              ) : directive.file_path ? (
                /* Gérer les fichiers avec chemin */
                <div className="w-full h-96">
                  <iframe 
                    src={directive.file_path}
                    className="w-full h-full border rounded"
                    title={fileName}
                  />
                </div>
              ) : (
                /* Fallback pour autres types */
                <div className="text-gray-600">
                  <p>Type de document : {directive.content_type || 'Non spécifié'}</p>
                  <p className="mt-2 text-sm">
                    {directive.description || directive.content || 'Aucune description disponible'}
                  </p>
                  {directive.content && typeof directive.content === 'object' && (
                    <pre className="mt-4 p-4 bg-gray-50 rounded text-xs overflow-auto">
                      {JSON.stringify(directive.content, null, 2)}
                    </pre>
                  )}
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

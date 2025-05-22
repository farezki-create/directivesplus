
import React from "react";
import MirrorSourceAlert from "./MirrorSourceAlert";

interface DirectivesContentProps {
  directives: any;
  source: string;
}

const DirectivesContent: React.FC<DirectivesContentProps> = ({ directives, source }) => {
  // Log what we're rendering for debugging
  React.useEffect(() => {
    console.log("DirectivesContent rendering with:", { 
      directivesType: typeof directives,
      directivesContent: directives,
      source,
      isPDFUrl: typeof directives === 'string' && (
        directives.startsWith('data:application/pdf') || 
        directives.endsWith('.pdf') ||
        directives.includes('storage.googleapis.com')
      )
    });
  }, [directives, source]);

  // Handle different possible types of directives
  if (!directives) {
    return <p className="text-gray-500 italic">Aucune directive disponible</p>;
  }
  
  // Handle URL links to PDF documents (from storage)
  if (typeof directives === 'string' && (
      directives.endsWith('.pdf') || 
      directives.includes('storage.googleapis.com') ||
      directives.includes('firebasestorage.googleapis.com'))
  ) {
    console.log("Affichage du PDF depuis l'URL:", directives);
    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={directives}
            className="w-full h-[70vh]"
            title="Document (PDF)"
            allow="fullscreen"
          />
        </div>
        <p className="text-sm text-gray-500">
          Source du document : {source}
        </p>
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Format de PDF (data URI)
  if (typeof directives === 'string' && directives.startsWith('data:application/pdf')) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={directives}
            className="w-full h-[70vh]"
            title="Directives anticipées (PDF)"
          />
        </div>
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Si c'est un objet contenant un PDF dans le champ contenu
  if (typeof directives === 'object' && !Array.isArray(directives) && 
      directives.contenu && typeof directives.contenu === 'string' && 
      directives.contenu.startsWith('data:application/pdf')) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={directives.contenu}
            className="w-full h-[70vh]"
            title="Directives anticipées (PDF)"
          />
        </div>
        <div className="text-sm text-gray-600">
          {directives.date_creation && (
            <p>Date de création: {new Date(directives.date_creation).toLocaleDateString('fr-FR')}</p>
          )}
          {directives.description && (
            <p className="mt-1">{directives.description}</p>
          )}
        </div>
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Si c'est un objet standard, afficher chaque propriété comme une ligne
  if (typeof directives === 'object' && !Array.isArray(directives)) {
    return (
      <div className="space-y-4">
        {Object.entries(directives).map(([key, value]) => (
          <div key={key} className="border-b pb-2">
            <h3 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h3>
            <div className="mt-1 text-gray-600">
              {typeof value === 'object' 
                ? <pre className="bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                : String(value)}
            </div>
          </div>
        ))}
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Si c'est une chaîne, l'afficher directement
  if (typeof directives === 'string') {
    return (
      <div>
        <p className="whitespace-pre-wrap text-gray-700">{directives}</p>
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Si c'est un tableau, mapper chaque élément
  if (Array.isArray(directives)) {
    return (
      <div className="space-y-4">
        {directives.map((item, index) => (
          <div key={index} className="border-b pb-2">
            {typeof item === 'object' ? (
              Object.entries(item).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <h3 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h3>
                  <div className="mt-1 text-gray-600">{String(value)}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">{String(item)}</p>
            )}
          </div>
        ))}
        {source === "image miroir" && <MirrorSourceAlert />}
      </div>
    );
  }
  
  // Fallback pour tout autre type
  return (
    <>
      <p className="whitespace-pre-wrap">
        {String(directives || "Aucune directive disponible")}
      </p>
      {source === "image miroir" && <MirrorSourceAlert />}
    </>
  );
};

export default DirectivesContent;


interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  // Ajout de logs pour aider au débogage
  console.log("[PDFViewer] Rendering with URL:", pdfUrl);

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  // Nettoyage de l'URL pour éliminer les doubles slashes potentiels
  const cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
  console.log("[PDFViewer] Cleaned URL:", cleanUrl);

  // Vérification des URL de data: pour s'assurer qu'elles sont correctement formatées
  const isDataUrl = cleanUrl.startsWith('data:');
  
  return (
    <div className="flex-1 min-h-[700px] border rounded relative">
      <iframe
        src={cleanUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        id="pdf-viewer-iframe"
        allow="fullscreen"
        loading="eager"
        onError={(e) => {
          console.error("[PDFViewer] Error loading PDF:", e);
        }}
      />
      {isDataUrl && cleanUrl.length > 100000 && (
        <div className="absolute bottom-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          Document PDF chargé en mémoire
        </div>
      )}
    </div>
  );
}

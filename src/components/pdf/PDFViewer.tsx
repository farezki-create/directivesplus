
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when PDF URL changes
    if (pdfUrl) {
      setLoading(true);
      setError(null);
    }
  }, [pdfUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError("Impossible de charger le document PDF");
  };

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <div className="flex-1 h-full border rounded overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">Chargement du document...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex flex-col items-center text-center p-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-sm text-gray-600 mt-2">
              Le format du document n'est peut-être pas supporté par votre navigateur ou le fichier est corrompu.
            </p>
          </div>
        </div>
      )}
      
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        id="pdf-viewer-iframe"
        allow="fullscreen"
        loading="eager"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

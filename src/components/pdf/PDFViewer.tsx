
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [safeUrl, setSafeUrl] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when PDF URL changes
    if (pdfUrl) {
      setLoading(true);
      setError(null);
      
      // Process the PDF URL to ensure it's safe
      try {
        // Si c'est une URL de données (data URL), nous devons la traiter différemment
        if (pdfUrl.startsWith('data:application/pdf')) {
          // Pour les URL de données, nous créons un Blob pour éviter les problèmes de sécurité
          // avec Chrome qui bloque parfois les data URLs directes
          fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
              // Créer une URL d'objet à partir du Blob
              const blobUrl = URL.createObjectURL(blob);
              setSafeUrl(blobUrl);
              setLoading(false);
            })
            .catch(err => {
              console.error("Error converting data URL to blob:", err);
              setError("Impossible de préparer le document PDF");
              setLoading(false);
            });
        } else {
          // URL normale, on peut l'utiliser directement
          setSafeUrl(pdfUrl);
          // On laisse l'événement onLoad gérer l'état de chargement
        }
      } catch (err) {
        console.error("Error processing PDF URL:", err);
        setError("URL du document invalide");
        setLoading(false);
      }
    } else {
      setSafeUrl(null);
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Libérer les ressources d'URL.createObjectURL
      if (safeUrl && safeUrl.startsWith('blob:')) {
        URL.revokeObjectURL(safeUrl);
      }
    };
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
              Le format du document n'est peut-être pas supporté par votre navigateur, le fichier est corrompu, ou votre navigateur bloque l'affichage pour des raisons de sécurité.
            </p>
          </div>
        </div>
      )}
      
      {safeUrl && (
        <iframe
          src={safeUrl}
          className="w-full h-full border-0"
          title="PDF Preview"
          id="pdf-viewer-iframe"
          allow="fullscreen"
          loading="eager"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin"
        />
      )}
    </div>
  );
}


import { useIsMobile } from "@/hooks/use-mobile";

interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const isMobile = useIsMobile();
  
  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  return (
    <div className={`flex-1 ${isMobile ? 'min-h-[60vh]' : 'min-h-[75vh]'} border rounded overflow-hidden`}>
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
        id="pdf-viewer-iframe"
        allow="fullscreen"
        loading="eager"
      />
    </div>
  );
}

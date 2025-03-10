
interface PDFViewerProps {
  pdfUrl: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  // Vérifier que l'URL est valide (blob: ou data:)
  const isValidPdfUrl = pdfUrl.startsWith("blob:") || pdfUrl.startsWith("data:");
  
  if (!isValidPdfUrl) {
    console.error("[PDFViewer] Invalid PDF URL format:", pdfUrl);
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Format de document non valide
      </div>
    );
  }

  // Add additional security attributes to the iframe
  return (
    <div className="flex-1 min-h-[500px] border rounded">
      <iframe
        src={pdfUrl}
        className="w-full h-full min-h-[500px]"
        title="PDF Preview"
        style={{ border: 'none' }}
        sandbox="allow-same-origin allow-scripts"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

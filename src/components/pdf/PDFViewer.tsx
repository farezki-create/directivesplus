
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

  return (
    <div className="flex-1 min-h-[500px] border rounded overflow-hidden">
      <iframe
        src={pdfUrl}
        className="w-full h-full min-h-[500px] border-0"
        title="PDF Preview"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
}

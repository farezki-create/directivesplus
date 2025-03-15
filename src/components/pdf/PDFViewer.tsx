
interface PDFViewerProps {
  textContent?: string | null;
}

export function PDFViewer({ textContent }: PDFViewerProps) {
  // Enhanced debugging
  console.log("[PDFViewer] Rendering with text content available:", !!textContent);

  // If text content is provided, display it in a pre-formatted text box
  if (textContent) {
    return (
      <div className="flex-1 border rounded overflow-auto bg-white p-6">
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {textContent}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Aucun document à afficher
    </div>
  );
}


interface PDFViewerProps {
  pdfUrl: string | null;
  textContent?: string | null;
}

export function PDFViewer({ pdfUrl, textContent }: PDFViewerProps) {
  // Enhanced debugging
  console.log("[PDFViewer] Rendering with URL:", pdfUrl, "Text content available:", !!textContent);

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

  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Aucun document à afficher
      </div>
    );
  }

  // Improved URL cleaning to handle various common URL issues
  let cleanUrl = pdfUrl;
  
  try {
    // Fix double slashes but preserve http:// and https://
    cleanUrl = pdfUrl.replace(/([^:])\/\/+/g, '$1/');
    
    // Make sure data URLs are properly formatted
    if (pdfUrl.startsWith('data:')) {
      // Ensure correct format for data URLs
      if (!pdfUrl.includes('base64,')) {
        console.error("[PDFViewer] Invalid data URL format");
        return (
          <div className="flex-1 flex items-center justify-center text-red-500">
            Format d'URL invalide
          </div>
        );
      }
    }
    
    console.log("[PDFViewer] Cleaned URL (beginning):", cleanUrl.substring(0, 100));
  } catch (error) {
    console.error("[PDFViewer] Error cleaning URL:", error);
  }

  // Check if URL is a valid format we can display
  const isDataUrl = cleanUrl.startsWith('data:');
  const isHttpUrl = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://');
  
  if (!isDataUrl && !isHttpUrl) {
    console.error("[PDFViewer] Invalid URL format:", cleanUrl.substring(0, 100));
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Format d'URL invalide
      </div>
    );
  }
  
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

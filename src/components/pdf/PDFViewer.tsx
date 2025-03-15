
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PDFViewerProps {
  textContent?: string | null;
}

export function PDFViewer({ textContent }: PDFViewerProps) {
  // Enhanced debugging
  console.log("[PDFViewer] Rendering with text content available:", !!textContent);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Focus on the text area when content is loaded
  useEffect(() => {
    if (textContent && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [textContent]);

  // If text content is provided, display it in a scrollable, selectable text area
  if (textContent) {
    return (
      <ScrollArea className="flex-1 h-[60vh]">
        <div className="bg-white p-6 h-full">
          <textarea
            ref={textAreaRef}
            className="w-full h-full font-sans text-sm resize-none focus:outline-none focus:ring-0 border-0"
            value={textContent}
            readOnly
            spellCheck={false}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      Aucun document à afficher
    </div>
  );
}


import { FileText } from "lucide-react";

interface PreviewContentProps {
  pdfUrl: string | null;
}

export function PreviewContent({ pdfUrl }: PreviewContentProps) {
  if (!pdfUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <FileText className="h-10 w-10 text-gray-400" />
          <p>Aucun document à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[500px] border rounded">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
      />
    </div>
  );
}

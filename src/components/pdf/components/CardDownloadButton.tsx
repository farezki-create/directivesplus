
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CardDownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
}

export function CardDownloadButton({ onDownload, isDownloading = false }: CardDownloadButtonProps) {
  return (
    <Button
      onClick={onDownload}
      variant="outline"
      className="flex items-center gap-2"
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <div className="h-4 w-4 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          Téléchargement...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Télécharger la carte
        </>
      )}
    </Button>
  );
}

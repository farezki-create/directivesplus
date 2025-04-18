
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
      <FileText className="h-4 w-4" />
      {isDownloading ? "Téléchargement..." : "Télécharger la carte"}
    </Button>
  );
}

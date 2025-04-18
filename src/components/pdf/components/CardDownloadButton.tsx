
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface CardDownloadButtonProps {
  onDownload: () => void;
}

export function CardDownloadButton({ onDownload }: CardDownloadButtonProps) {
  return (
    <Button
      onClick={onDownload}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      Télécharger la carte
    </Button>
  );
}

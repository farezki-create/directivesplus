
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, RefreshCw } from "lucide-react";

interface DirectDownloadButtonsProps {
  onRetry: () => void;
  onDirectDownload: () => void;
  onOpenInNewTab: () => void;
}

export function DirectDownloadButtons({
  onRetry,
  onDirectDownload,
  onOpenInNewTab
}: DirectDownloadButtonsProps) {
  return (
    <>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
      <Button 
        variant="outline" 
        onClick={onDirectDownload}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
      <Button 
        variant="outline"
        onClick={onOpenInNewTab}
        className="flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Ouvrir
      </Button>
    </>
  );
}


import { Button } from "@/components/ui/button";
import { FileText, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CardDownloadButtonProps {
  onDownload: () => void;
  isDownloading?: boolean;
  hasError?: boolean;
}

export function CardDownloadButton({ 
  onDownload, 
  isDownloading = false,
  hasError = false
}: CardDownloadButtonProps) {
  const { toast } = useToast();
  
  const handleClick = () => {
    if (hasError) {
      toast({
        title: "Attention",
        description: "Un problème est survenu lors du dernier téléchargement. Nous allons réessayer.",
        variant: "destructive",
      });
    }
    onDownload();
  };
  
  return (
    <Button
      onClick={handleClick}
      variant={hasError ? "destructive" : "outline"}
      className="flex items-center gap-2"
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <div className="h-4 w-4 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          Téléchargement...
        </>
      ) : hasError ? (
        <>
          <AlertCircle className="h-4 w-4" />
          Réessayer le téléchargement
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

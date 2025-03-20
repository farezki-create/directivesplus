
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { handlePDFDownload } from "./utils/PDFGenerationUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFGenerationButtonsProps {
  pdfUrl: string | null;
  isGenerating: boolean;
  onGenerateClick: () => void;
  documentIdentifier?: string | null;
}

export function PDFGenerationButtons({ 
  pdfUrl, 
  isGenerating, 
  onGenerateClick,
  documentIdentifier 
}: PDFGenerationButtonsProps) {
  const { toast } = useToast();

  const handleDownloadClick = () => {
    if (pdfUrl) {
      // Génère un nom de fichier personnalisé avec l'identifiant du document si disponible
      const customFilename = documentIdentifier 
        ? `directives-anticipees_${documentIdentifier}.pdf` 
        : undefined;
      
      handlePDFDownload(pdfUrl, customFilename);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer le document.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        onClick={onGenerateClick}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      <Button
        onClick={handleDownloadClick}
        className="flex items-center gap-2"
        variant="outline"
        disabled={!pdfUrl}
      >
        <Download className="h-4 w-4" />
        Télécharger sur mon ordinateur
      </Button>
    </div>
  );
}

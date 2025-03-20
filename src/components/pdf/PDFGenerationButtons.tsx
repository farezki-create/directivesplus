
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { handlePDFDownload } from "./utils/PDFGenerationUtils";
import { useToast } from "@/hooks/use-toast";

interface PDFGenerationButtonsProps {
  pdfUrl: string | null;
  isGenerating: boolean;
  onGenerateClick: () => void;
}

export function PDFGenerationButtons({ pdfUrl, isGenerating, onGenerateClick }: PDFGenerationButtonsProps) {
  const { toast } = useToast();

  const handleDownloadClick = () => {
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
      toast({
        title: "Téléchargement",
        description: "Le téléchargement de votre fichier a démarré.",
      });
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

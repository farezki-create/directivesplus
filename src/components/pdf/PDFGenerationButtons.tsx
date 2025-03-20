
import { Button } from "@/components/ui/button";
import { FileText, Download, HelpCircle } from "lucide-react";
import { handlePDFDownload } from "./utils/PDFGenerationUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDownloadClick = () => {
    if (pdfUrl) {
      // Génère un nom de fichier personnalisé avec l'identifiant du document si disponible
      const customFilename = documentIdentifier 
        ? `directives-anticipees_${documentIdentifier}.pdf` 
        : undefined;
      
      handlePDFDownload(pdfUrl, customFilename);
      
      // Affiche les instructions après le téléchargement
      setShowInstructions(true);
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
      
      <div className="flex items-center">
        <Button
          onClick={handleDownloadClick}
          className="flex items-center gap-2"
          variant="outline"
          disabled={!pdfUrl}
        >
          <Download className="h-4 w-4" />
          Télécharger sur mon ordinateur
        </Button>
        
        {pdfUrl && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-1"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aide sur le téléchargement</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {showInstructions && (
        <div className="text-sm border p-3 rounded-md bg-gray-50">
          <h4 className="font-medium mb-2">À propos du téléchargement</h4>
          <p>Le fichier PDF sera téléchargé dans votre dossier de téléchargements par défaut.</p>
          <p className="mt-2 text-xs text-gray-600">
            Pour le déplacer vers un autre emplacement (ex: {" "}
            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
              Documents/Application DirectivesPlus/sauvegarde DA
            </code>
            ), vous devrez le faire manuellement après le téléchargement.
          </p>
          <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs">
            <p className="font-medium text-blue-700">Astuce de productivité:</p>
            <p className="text-gray-700 mt-1">
              Sur Mac, vous pouvez utiliser des applications comme Hazel ou des Automator pour déplacer automatiquement 
              les fichiers téléchargés avec "directives-anticipees" dans le nom vers votre dossier cible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

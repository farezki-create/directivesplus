
import { FileText as FileTextIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFGenerationButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  generationFailed: boolean;
}

export function PDFGenerationButton({ 
  onClick, 
  isGenerating, 
  generationFailed 
}: PDFGenerationButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="flex items-center gap-2"
      disabled={isGenerating}
    >
      {generationFailed ? (
        <>
          <RefreshCw className="h-4 w-4" />
          Réessayer la génération
        </>
      ) : (
        <>
          <FileTextIcon className="h-4 w-4" />
          Générer en PDF
        </>
      )}
    </Button>
  );
}

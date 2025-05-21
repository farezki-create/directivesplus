
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";

interface CardActionsProps {
  onDownload?: () => void;
  onPrint?: () => void;
  onGenerate?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isGenerating?: boolean;
  codesReady?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  onGenerate,
  disabled = false,
  isLoading = false,
  isGenerating = false,
  codesReady = false
}) => {
  return (
    <div className="mt-4 flex flex-wrap gap-3 justify-center">
      {onDownload && (
        <Button
          onClick={onDownload}
          variant="outline"
          className="flex items-center gap-2"
          disabled={!codesReady || disabled}
        >
          <Download size={16} />
          Télécharger
        </Button>
      )}
      
      {onPrint && (
        <Button
          onClick={onPrint}
          variant="outline"
          className="flex items-center gap-2"
          disabled={!codesReady || disabled}
        >
          <Printer size={16} />
          Imprimer
        </Button>
      )}

      {onGenerate && (
        <Button
          onClick={onGenerate}
          variant="default"
          className="flex items-center gap-2 bg-directiveplus-600 hover:bg-directiveplus-700"
          disabled={isGenerating || isLoading || disabled}
        >
          <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "Génération..." : "Régénérer les codes"}
        </Button>
      )}
    </div>
  );
};

export default CardActions;

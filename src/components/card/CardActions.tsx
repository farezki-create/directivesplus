
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";

interface CardActionsProps {
  onDownload: () => void;
  onPrint: () => void;
  onGenerate?: () => void;
  disabled: boolean;
  isLoading?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  onGenerate,
  disabled,
  isLoading = false
}) => {
  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      {onGenerate && (
        <Button
          onClick={onGenerate}
          variant="default"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Génération en cours..." : "Générer la carte"}
        </Button>
      )}
      
      <Button
        onClick={onDownload}
        variant="outline"
        className="flex items-center gap-2"
        disabled={disabled}
      >
        <Download size={16} />
        Télécharger
      </Button>
      
      <Button
        onClick={onPrint}
        variant="outline"
        className="flex items-center gap-2"
        disabled={disabled}
      >
        <Printer size={16} />
        Imprimer
      </Button>
    </div>
  );
};

export default CardActions;

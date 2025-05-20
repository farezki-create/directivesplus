
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";

interface CardActionsProps {
  onDownload?: () => void;
  onPrint?: () => void;
  onGenerate?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

// Le composant CardActions est conservé mais ne sera plus utilisé pour la génération
const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  onGenerate,
  disabled = true,
  isLoading = false
}) => {
  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      {onGenerate && (
        <Button
          onClick={onGenerate}
          variant="default"
          className="flex items-center gap-2"
          disabled={true}
        >
          <RefreshCw size={16} />
          Fonctionnalité désactivée
        </Button>
      )}
      
      {onDownload && (
        <Button
          onClick={onDownload}
          variant="outline"
          className="flex items-center gap-2"
          disabled={true}
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
          disabled={true}
        >
          <Printer size={16} />
          Imprimer
        </Button>
      )}
    </div>
  );
};

export default CardActions;

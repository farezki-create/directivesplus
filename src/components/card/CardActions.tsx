
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface CardActionsProps {
  onDownload?: () => void;
  onPrint?: () => void;
  onGenerate?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  codesReady?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  disabled = false,
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
    </div>
  );
};

export default CardActions;

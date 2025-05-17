
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

interface CardActionsProps {
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  disabled: boolean;
  showShare: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  onShare,
  disabled,
  showShare
}) => {
  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
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
      
      {showShare && (
        <Button
          onClick={onShare}
          variant="outline"
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <Share2 size={16} />
          Partager
        </Button>
      )}
    </div>
  );
};

export default CardActions;

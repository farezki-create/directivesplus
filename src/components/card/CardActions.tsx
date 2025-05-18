
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

interface CardActionsProps {
  onDownload: () => void;
  onPrint: () => void;
  disabled: boolean;
  onShare?: () => void;  // Made optional with ?
  showShare?: boolean;   // Added showShare prop (optional)
}

const CardActions: React.FC<CardActionsProps> = ({
  onDownload,
  onPrint,
  disabled,
  onShare,
  showShare = false,  // Default to false
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

      {showShare && onShare && (
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


import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Clock, CreditCard } from "lucide-react";

interface ShareDialogActionsProps {
  accessCode: string;
  isExtending: boolean;
  isRegenerating: boolean;
  onCopyCode: () => void;
  onRegenerateCode: () => void;
  onExtendCode: () => void;
  onShowCard: () => void;
}

export const ShareDialogActions: React.FC<ShareDialogActionsProps> = ({
  accessCode,
  isExtending,
  isRegenerating,
  onCopyCode,
  onRegenerateCode,
  onExtendCode,
  onShowCard
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={onCopyCode}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copier
        </Button>

        <Button 
          onClick={onRegenerateCode}
          variant="outline"
          disabled={isRegenerating}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {isRegenerating ? "Génération..." : "Nouveau code"}
        </Button>
      </div>

      <Button 
        onClick={onExtendCode}
        variant="outline"
        disabled={isExtending}
        className="flex items-center gap-2 w-full"
      >
        <Clock className="h-4 w-4" />
        {isExtending ? "Prolongation..." : "Prolonger d'1 an"}
      </Button>

      <Button 
        onClick={onShowCard}
        className="flex items-center gap-2 w-full"
      >
        <CreditCard className="h-4 w-4" />
        Générer la carte d'accès
      </Button>
    </div>
  );
};

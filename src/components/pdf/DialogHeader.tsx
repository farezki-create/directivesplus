
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Maximize2, Minimize2 } from "lucide-react";

interface DialogHeaderProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export function DialogHeader({ isFullscreen, toggleFullscreen }: DialogHeaderProps) {
  return (
    <DialogTitle className="text-lg font-semibold mb-4 flex justify-between items-center">
      <span>Prévisualisation du document</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleFullscreen}
        className="ml-4"
      >
        {isFullscreen ? (
          <><Minimize2 className="h-4 w-4 mr-2" />Réduire</>
        ) : (
          <><Maximize2 className="h-4 w-4 mr-2" />Agrandir</>
        )}
      </Button>
    </DialogTitle>
  );
}

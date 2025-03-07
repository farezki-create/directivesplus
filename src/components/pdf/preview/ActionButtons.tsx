
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ActionButtonsProps {
  onDownload: () => void;
  onPrint: () => void;
}

export function ActionButtons({ onDownload, onPrint }: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
      <Button variant="outline" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
}

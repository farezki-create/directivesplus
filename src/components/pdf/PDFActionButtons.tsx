
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PDFActionButtonsProps {
  onDownload: () => void;
}

export function PDFActionButtons({ onDownload }: PDFActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger
      </Button>
    </div>
  );
}

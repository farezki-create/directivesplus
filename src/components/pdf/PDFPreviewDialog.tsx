import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFActions } from "./PDFActions";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export const PDFPreviewDialog = ({
  open,
  onOpenChange,
  pdfUrl,
  onEmail,
  onSave,
  onPrint,
}: PDFPreviewDialogProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Aperçu du document</DialogTitle>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Button>
        </DialogHeader>
        
        {pdfUrl && (
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 min-h-0">
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded-lg shadow-sm"
                title="Aperçu PDF"
              />
            </div>
            
            <PDFActions 
              onEmail={onEmail}
              onSave={onSave}
              onPrint={onPrint}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
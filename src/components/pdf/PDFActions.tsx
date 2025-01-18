import { Button } from "@/components/ui/button";
import { Mail, Download, Printer } from "lucide-react";

interface PDFActionsProps {
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export const PDFActions = ({ onEmail, onSave, onPrint }: PDFActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onEmail}>
        <Mail className="mr-2 h-4 w-4" />
        Envoyer par email
      </Button>
      <Button variant="outline" onClick={onSave}>
        <Download className="mr-2 h-4 w-4" />
        Enregistrer
      </Button>
      <Button variant="outline" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};
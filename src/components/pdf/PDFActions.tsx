import { Button } from "@/components/ui/button";
import { Mail, Download, Printer } from "lucide-react";

interface PDFActionsProps {
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export const PDFActions = ({ onEmail, onSave, onPrint }: PDFActionsProps) => {
  return (
    <div className="flex flex-wrap justify-end gap-4 p-2 bg-gray-50 rounded-lg">
      <Button variant="outline" onClick={onEmail} className="shadow-sm">
        <Mail className="mr-2 h-4 w-4" />
        Envoyer par email
      </Button>
      <Button variant="outline" onClick={onSave} className="shadow-sm">
        <Download className="mr-2 h-4 w-4" />
        Enregistrer
      </Button>
      <Button variant="outline" onClick={onPrint} className="shadow-sm">
        <Printer className="mr-2 h-4 w-4" />
        Imprimer
      </Button>
    </div>
  );
};
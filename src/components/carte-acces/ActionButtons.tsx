
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface ActionButtonsProps {
  onPrint: () => void;
  onDownload: () => void;
}

const ActionButtons = ({ onPrint, onDownload }: ActionButtonsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8 print:hidden">
      <Button 
        onClick={onPrint} 
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
      >
        <Printer size={16} />
        Imprimer
      </Button>
      <Button 
        onClick={onDownload} 
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
      >
        <Download size={16} />
        Télécharger PDF
      </Button>
    </div>
  );
};

export default ActionButtons;

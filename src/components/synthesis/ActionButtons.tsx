
import { Button } from "@/components/ui/button";
import { Save, Download } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  onGenerate: () => Promise<void>;
  saving: boolean;
  generating: boolean;
}

const ActionButtons = ({ 
  onSave, 
  onGenerate, 
  saving, 
  generating 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <Button
        variant="default"
        onClick={onSave}
        className="flex items-center gap-2"
        disabled={saving}
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        ) : (
          <Save size={16} />
        )}
        Enregistrer
      </Button>
      
      <Button
        variant="outline"
        onClick={onGenerate}
        className="flex items-center gap-2"
        disabled={generating}
      >
        {generating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-directiveplus-600"></div>
        ) : (
          <Download size={16} />
        )}
        Générer PDF
      </Button>
    </div>
  );
};

export default ActionButtons;

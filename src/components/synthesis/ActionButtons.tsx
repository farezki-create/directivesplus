
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => Promise<void>;
  saving: boolean;
}

const ActionButtons = ({ 
  onSave, 
  saving 
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
        Enregistrer et générer PDF
      </Button>
    </div>
  );
};

export default ActionButtons;

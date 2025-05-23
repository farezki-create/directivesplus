
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  saving: boolean;
  disabled?: boolean;
}

export const SaveButton = ({ onSave, saving, disabled }: SaveButtonProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button 
        onClick={onSave}
        disabled={saving || disabled}
        className="bg-directiveplus-600 hover:bg-directiveplus-700"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {saving ? "Enregistrement..." : "Enregistrer les réponses"}
      </Button>
    </div>
  );
};

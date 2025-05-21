
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  saving: boolean;
}

const ActionButtons = ({ onSave, saving }: ActionButtonsProps) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          En enregistrant vos directives, elles seront disponibles à la fois dans votre espace personnel 
          et accessibles via votre code d'accès pour les professionnels de santé.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Enregistrement en cours..." : "Enregistrer les directives anticipées"}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;

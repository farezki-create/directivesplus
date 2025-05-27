
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  saving: boolean;
}

const ActionButtons = ({ onSave, saving }: ActionButtonsProps) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          En enregistrant vos directives, elles seront disponibles à la fois dans votre espace personnel 
          et accessibles via votre code d'accès pour les professionnels de santé.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center">
        <Button
          onClick={onSave}
          disabled={saving}
          size="lg"
          className="flex items-center gap-3 px-8 py-3 text-lg font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Valider signature et enregistrer les directives anticipées
            </>
          )}
        </Button>
      </div>
      
      {saving && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            Préparation de votre document PDF personnalisé...
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;


import { AlertTriangle } from "lucide-react";

interface CriticalSymptomWarningProps {
  hasCriticalSymptoms: boolean;
}

export default function CriticalSymptomWarning({ hasCriticalSymptoms }: CriticalSymptomWarningProps) {
  if (!hasCriticalSymptoms) return null;

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-red-800">Auto-évaluation élevée détectée</h4>
          <p className="text-sm text-red-700">
            Vos évaluations élevées seront transmises à vos contacts d'alerte après l'enregistrement, 
            afin de faciliter la communication avec votre équipe soignante. 
            Ceci ne constitue pas un diagnostic médical.
          </p>
        </div>
      </div>
    </div>
  );
}

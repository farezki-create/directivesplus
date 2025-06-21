
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
          <h4 className="font-medium text-red-800">Symptômes critiques détectés</h4>
          <p className="text-sm text-red-700">
            Des évaluations élevées seront signalées à vos contacts d'alerte après l'enregistrement.
          </p>
        </div>
      </div>
    </div>
  );
}

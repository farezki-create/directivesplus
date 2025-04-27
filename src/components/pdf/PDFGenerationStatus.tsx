
import { Progress } from "@/components/ui/progress";
import { Loader2, FileText, CreditCard } from "lucide-react";

interface PDFGenerationStatusProps {
  stage: "idle" | "generating-directive" | "saving-directive" | "generating-card" | "saving-card" | "complete";
  progress: number;
}

export function PDFGenerationStatus({ stage, progress }: PDFGenerationStatusProps) {
  const getCurrentStatusMessage = () => {
    switch (stage) {
      case "generating-directive":
        return "Génération de vos directives anticipées en cours...";
      case "saving-directive":
        return "Sauvegarde de vos directives anticipées...";
      case "generating-card":
        return "Génération de votre carte d'accès en cours...";
      case "saving-card":
        return "Sauvegarde de votre carte d'accès...";
      case "complete":
        return "Finalisation...";
      default:
        return "";
    }
  };

  const getCurrentIcon = () => {
    switch (stage) {
      case "generating-directive":
      case "saving-directive":
        return <FileText className="h-4 w-4 mr-2" />;
      case "generating-card":
      case "saving-card":
        return <CreditCard className="h-4 w-4 mr-2" />;
      default:
        return <Loader2 className="h-4 w-4 mr-2 animate-spin" />;
    }
  };

  if (stage === "idle") return null;

  return (
    <div className="border rounded-lg p-4 mb-6 bg-gray-50">
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center gap-2 text-sm">
          {getCurrentIcon()}
          <span className="text-gray-600">{getCurrentStatusMessage()}</span>
        </div>
      </div>
    </div>
  );
}

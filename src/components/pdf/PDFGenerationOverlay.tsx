
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2 } from "lucide-react";

interface PDFGenerationOverlayProps {
  isGenerating: boolean;
  progress: number;
  waitingMessage?: string;
  isCard?: boolean;
}

export function PDFGenerationOverlay({ 
  isGenerating, 
  progress, 
  waitingMessage,
  isCard = false
}: PDFGenerationOverlayProps) {
  if (!isGenerating) return null;

  return (
    <div className="border rounded-lg p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${isCard ? "animate-pulse" : "animate-bounce"}`}>
          <FileText className={`h-5 w-5 ${isCard ? "text-indigo-600" : "text-purple-600"}`} />
        </div>
        <h3 className="font-medium text-purple-700">
          {isCard ? "Préparation de votre carte d'accès" : "Préparation de vos directives"}
        </h3>
      </div>
      
      <Progress 
        value={progress} 
        className={`h-2 ${isCard ? "bg-indigo-100" : "bg-purple-100"}`} 
      />
      
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className={`h-4 w-4 animate-spin ${isCard ? "text-indigo-600" : "text-purple-600"}`} />
        <span className={`${isCard ? "text-indigo-700" : "text-purple-700"} animate-pulse`}>
          {waitingMessage || (isCard ? "Génération de votre carte en cours..." : "Génération en cours...")}
        </span>
      </div>
    </div>
  );
}

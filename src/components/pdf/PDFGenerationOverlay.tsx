
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2 } from "lucide-react";

interface PDFGenerationOverlayProps {
  isGenerating: boolean;
  progress: number;
  waitingMessage?: string;
}

export function PDFGenerationOverlay({ 
  isGenerating, 
  progress, 
  waitingMessage 
}: PDFGenerationOverlayProps) {
  if (!isGenerating) return null;

  return (
    <div className="border rounded-lg p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="animate-bounce">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="font-medium text-purple-700">
          Préparation de vos directives
        </h3>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 bg-purple-100" 
      />
      
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
        <span className="text-purple-700 animate-pulse">
          {waitingMessage || "Génération en cours..."}
        </span>
      </div>
    </div>
  );
}

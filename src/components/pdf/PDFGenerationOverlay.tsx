
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [animationClass, setAnimationClass] = useState("animate-pulse");
  
  // Cycle through different animation classes
  useEffect(() => {
    if (isGenerating) {
      const animations = ["animate-pulse", "animate-bounce", "animate-fade-in"];
      const interval = setInterval(() => {
        setAnimationClass((prev) => {
          const currentIndex = animations.indexOf(prev);
          return animations[(currentIndex + 1) % animations.length];
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="border rounded-lg p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className={animationClass}>
          {isCard ? (
            <Sparkles className="h-5 w-5 text-indigo-600" />
          ) : (
            <FileText className="h-5 w-5 text-purple-600" />
          )}
        </div>
        <h3 className="font-medium text-purple-700">
          {isCard ? "Préparation de votre carte d'accès" : "Préparation de vos directives"}
        </h3>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 bg-purple-100" 
      />
      
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className={`h-4 w-4 animate-spin ${isCard ? "text-indigo-600" : "text-purple-600"}`} />
        <span className="text-purple-700 animate-pulse">
          {waitingMessage || (isCard ? "Génération de votre carte en cours..." : "Génération en cours...")}
        </span>
      </div>
      
      {/* Rainbow animation effect at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full animate-pulse"></div>
    </div>
  );
}

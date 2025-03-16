
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface PDFGenerationProgressProps {
  isGenerating: boolean;
}

const waitingMessages = [
  "Préparation de votre document avec soin... 📝",
  "Mise en page de vos directives... 📄",
  "Ajout d'une touche de professionnalisme... ✨",
  "Finalisation des derniers détails... 🎯",
  "Vérification de la mise en forme... 🔍",
  "Assemblage de vos informations... 📋",
  "Plus que quelques secondes... ⏳",
  "Votre document est presque prêt... 🌟",
];

export function PDFGenerationProgress({ isGenerating }: PDFGenerationProgressProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      // Message rotation interval
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 100%
          if (prev >= 90) {
            return Math.min(prev + 0.5, 95);
          }
          return Math.min(prev + 5, 90);
        });
      }, 500);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      // Reset progress when not generating
      setProgress(0);
    }
  }, [isGenerating]);

  if (!isGenerating) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <Progress value={progress} className="h-2 w-full" />
        <p className="text-lg font-medium text-foreground animate-pulse">
          {waitingMessages[currentMessageIndex]}
        </p>
      </div>
    </div>
  );
}

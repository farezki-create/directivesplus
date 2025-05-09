
import React from "react";
import { Progress } from "@/components/ui/progress";

interface CardGenerationProgressProps {
  isGenerating: boolean;
  progress: number;
}

export function CardGenerationProgress({ isGenerating, progress }: CardGenerationProgressProps) {
  if (!isGenerating) return null;
  
  return (
    <div className="space-y-1">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center text-muted-foreground">
        Construction de votre carte d'accès médicale en cours...{progress === 100 ? " Terminé!" : ""}
      </p>
    </div>
  );
}

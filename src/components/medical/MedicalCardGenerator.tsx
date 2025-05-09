
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMedicalCardGenerator } from "@/hooks/useMedicalCardGenerator";
import { GenerateCardButton } from "./components/GenerateCardButton";
import { CardGenerationProgress } from "./components/CardGenerationProgress";

interface MedicalCardGeneratorProps {
  medicalData: any[];
}

export function MedicalCardGenerator({ medicalData }: MedicalCardGeneratorProps) {
  const { user } = useAuth();
  const { isGenerating, progress, handleGenerateMedicalCard } = useMedicalCardGenerator(medicalData);

  return (
    <div className="space-y-2">
      <GenerateCardButton 
        onClick={handleGenerateMedicalCard}
        disabled={isGenerating || !user}
        isGenerating={isGenerating}
      />
      
      <CardGenerationProgress 
        isGenerating={isGenerating}
        progress={progress}
      />
    </div>
  );
}

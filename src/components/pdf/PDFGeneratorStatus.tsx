
import { useEffect } from "react";
import { PDFGenerationOverlay } from "./PDFGenerationOverlay";
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "./types";

interface PDFGeneratorStatusProps {
  isGenerating: boolean;
  progress: number;
  currentWaitingMessage?: string;
  profile: UserProfile | null;
  pdfUrl: string | null;
  responses: any;
  synthesis?: { free_text: string } | null;
  isCard?: boolean;
}

export function PDFGeneratorStatus({
  isGenerating,
  progress,
  currentWaitingMessage,
  profile,
  pdfUrl,
  responses,
  synthesis,
  isCard
}: PDFGeneratorStatusProps) {
  useEffect(() => {
    if (!profile && isGenerating) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
    }
  }, [profile, isGenerating]);

  if (!isGenerating && !pdfUrl) {
    return null;
  }

  return (
    <PDFGenerationOverlay 
      isGenerating={isGenerating}
      progress={progress}
      waitingMessage={currentWaitingMessage}
      isCard={isCard}
    />
  );
}

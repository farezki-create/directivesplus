
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
    let timeoutId: NodeJS.Timeout | null = null;

    if (isGenerating && !profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      
      // Annuler la génération après un délai
      timeoutId = setTimeout(() => {
        toast({
          title: "Génération annulée",
          description: "La génération a été annulée en raison d'une erreur.",
          variant: "destructive",
        });
      }, 1500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [profile, isGenerating]);

  // N'afficher l'overlay que si la génération est active ou si le PDF est prêt
  if (!isGenerating && !pdfUrl) {
    return null;
  }

  return (
    <div className="mb-6">
      <PDFGenerationOverlay 
        isGenerating={isGenerating}
        progress={progress}
        waitingMessage={currentWaitingMessage}
        isCard={isCard}
      />
      
      {!isGenerating && pdfUrl && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-2 animate-fade-in">
          <p className="text-green-700 text-sm">
            {isCard 
              ? "Votre carte d'accès a été générée avec succès et sauvegardée dans vos documents."
              : "Vos directives ont été générées avec succès et sauvegardées dans vos documents."
            }
          </p>
        </div>
      )}
    </div>
  );
}

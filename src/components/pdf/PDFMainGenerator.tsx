
import { useState, useEffect } from "react";
import { handlePDFGeneration } from "./utils/PDFGenerationUtils";
import { UserProfile, TrustedPerson } from "./types";
import { toast } from "@/hooks/use-toast";
import { PDFGenerationButtons } from "./PDFGenerationButtons";
import { PDFGeneratorStatus } from "./PDFGeneratorStatus";
import { usePDFGenerationState } from "./usePDFGenerationState";
import { useNavigate } from "react-router-dom";

interface PDFMainGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  profile: UserProfile | null;
  responses: any;
  trustedPersons: TrustedPerson[];
  synthesis?: { free_text: string } | null;
  isCard?: boolean;
}

export function PDFMainGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  profile,
  responses,
  trustedPersons,
  synthesis,
  isCard
}: PDFMainGeneratorProps) {
  const navigate = useNavigate();
  const { 
    pdfUrl, setPdfUrl, 
    showPreview, setShowPreview,
    documentIdentifier, setDocumentIdentifier,
    isGenerating, setIsGenerating,
    progress, setProgress,
    currentWaitingMessage 
  } = usePDFGenerationState();

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setProgress(10);
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating PDF", isCard ? "as card format" : "as full document");
      
      // Assurons-nous que la synthèse est correctement formatée
      const finalSynthesisText = synthesisText || synthesis?.free_text || "";
      
      // Utilisons un timeout pour simuler le traitement et assurer la mise à jour de l'UI
      setTimeout(async () => {
        try {
          // On vérifie que les données sont correctes
          console.log("[PDFGenerator] Profile:", profile);
          console.log("[PDFGenerator] Responses:", responses);
          console.log("[PDFGenerator] Trusted persons count:", trustedPersons?.length || 0);
          console.log("[PDFGenerator] Synthesis text length:", finalSynthesisText.length);
          
          // Format des données pour être sûr que les réponses sont bien structurées
          const formattedResponses = {
            general: responses?.general || [],
            lifeSupport: responses?.lifeSupport || [],
            advancedIllness: responses?.advancedIllness || [],
            preferences: responses?.preferences || [],
            synthesis: { free_text: finalSynthesisText }
          };
          
          // Création d'une copie propre des données pour éviter des références circulaires
          const cleanProfile = { 
            ...profile,
            unique_identifier: profile.unique_identifier || userId
          };
          
          handlePDFGeneration(
            cleanProfile,
            formattedResponses,
            trustedPersons || [],
            (url) => {
              console.log("[PDFGenerator] PDF URL received:", url ? "URL length: " + url.length : "null");
              setProgress(100);
              setPdfUrl(url);
              
              if (onPdfGenerated && url) {
                console.log("[PDFGenerator] Notifying parent component of PDF generation");
                onPdfGenerated(url);
              }
              
              setIsGenerating(false);
              
              if (url) {
                // Save with the correct format designation
                const saveFormat = isCard ? 'card' : 'full';
                
                // Notify user of success
                toast({
                  title: "Succès",
                  description: isCard 
                    ? "Votre carte d'accès a été générée et sauvegardée." 
                    : "Vos directives ont été générées et sauvegardées.",
                });
              } else {
                console.error("[PDFGenerator] PDF generation failed - no URL returned");
                toast({
                  title: "Erreur",
                  description: "La génération du PDF a échoué. Veuillez réessayer.",
                  variant: "destructive",
                });
              }
            },
            setShowPreview,
            isCard
          );
        } catch (innerError) {
          console.error("[PDFGenerator] Inner error during PDF generation:", innerError);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération du PDF.",
            variant: "destructive",
          });
          setIsGenerating(false);
        }
      }, 500);
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <>
      <PDFGeneratorStatus
        isGenerating={isGenerating}
        progress={progress}
        currentWaitingMessage={currentWaitingMessage}
        profile={profile}
        pdfUrl={pdfUrl}
        responses={responses}
        synthesis={synthesis}
        isCard={isCard}
      />
      
      <PDFGenerationButtons 
        pdfUrl={pdfUrl}
        isGenerating={isGenerating}
        onGenerateClick={generatePDF}
        documentIdentifier={documentIdentifier}
        isCard={isCard}
      />
    </>
  );
}

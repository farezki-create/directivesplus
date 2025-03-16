
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePDFData } from "./usePDFData";
import { handlePDFGeneration } from "./utils/PDFGenerationUtils";

interface PDFGenerationButtonProps {
  userId: string;
  responses: any;
  onGenerationStart: () => void;
  onGenerationComplete: (url: string | null) => void;
  onShowPreview: (show: boolean) => void;
}

export function PDFGenerationButton({
  userId,
  responses,
  onGenerationStart,
  onGenerationComplete,
  onShowPreview
}: PDFGenerationButtonProps) {
  const { profile, trustedPersons, loading } = usePDFData();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    onGenerationStart();
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      onGenerationComplete(null);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      
      // Prepare a modified responses object without synthesis
      const pdfResponses = {...responses};
      // Explicitly remove 'synthesis' if it exists to ensure free text is not included
      if ('synthesis' in pdfResponses) {
        delete pdfResponses.synthesis;
      }
      
      // Small delay to ensure UI updates before heavy PDF generation starts
      setTimeout(() => {
        handlePDFGeneration(
          profile,
          pdfResponses, // Use the version without synthesis
          trustedPersons,
          (url) => {
            console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
            
            // Store the PDF URL in localStorage as a backup
            if (url) {
              try {
                localStorage.setItem(`pdf_${userId}`, url);
                console.log("[PDFGenerator] PDF URL saved to localStorage");
              } catch (e) {
                console.warn("[PDFGenerator] Could not save PDF to localStorage:", e);
              }
            }
            
            // Short delay to show 100% before hiding the loading screen
            setTimeout(() => {
              onGenerationComplete(url);
              setIsGenerating(false);
            }, 500);
          },
          onShowPreview
        );
      }, 500);
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
      onGenerationComplete(null);
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      className="flex items-center gap-2"
      disabled={isGenerating || loading}
    >
      <FileText className="h-4 w-4" />
      <Lock className="h-3 w-3" />
      Générer Mes directives anticipées
    </Button>
  );
}


import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PDFGenerationOverlay } from "./PDFGenerationOverlay";
import { toast } from "@/hooks/use-toast";
import { handlePDFGeneration } from "./utils/PDFGenerationUtils";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const { loading } = usePDFData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const currentWaitingMessage = "Génération et sauvegarde de vos directives anticipées...";

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(10);

    // Get profile data
    const { profile, trustedPersons } = usePDFData();
    const { responses, synthesis } = useQuestionnairesResponses(userId);
    
    if (!profile) {
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    // Simulated progress
    let currentProgress = 10;
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(Math.min(currentProgress, 95));
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
      }
    }, 200);

    // Simulate PDF generation (complete generation is handled in PDFUtils)
    setTimeout(async () => {
      try {
        handlePDFGeneration(
          profile,
          responses,
          trustedPersons,
          (url) => {
            setPdfUrl(url);
            setProgress(100);
            setIsGenerating(false);
            clearInterval(progressInterval);
            
            toast({
              title: "Succès",
              description: "Vos directives ont été générées et sauvegardées. Redirection vers vos documents...",
            });
            
            // Navigate to documents page after successful generation
            setTimeout(() => {
              navigate("/my-documents");
            }, 2000);
          },
          setShowPreview
        );
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la génération du PDF.",
          variant: "destructive",
        });
        setIsGenerating(false);
        clearInterval(progressInterval);
      }
    }, 2000);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {isGenerating && (
        <PDFGenerationOverlay 
          isGenerating={true}
          progress={progress}
          waitingMessage={currentWaitingMessage}
        />
      )}
      
      <Button 
        onClick={handleGenerate}
        className="flex items-center gap-3 h-auto py-4 w-full transition-all bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        disabled={isGenerating}
      >
        <div className="bg-white/20 p-2 rounded-full">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="text-left text-white">
          <div className="font-medium">Générer et enregistrer mes directives anticipées</div>
          <div className="text-sm opacity-90">
            Sauvegarder dans mes documents
          </div>
        </div>
      </Button>
    </>
  );
}

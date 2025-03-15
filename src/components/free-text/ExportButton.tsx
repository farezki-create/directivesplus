
import { Button } from "@/components/ui/button";
import { handlePDFGeneration, handlePDFDownload } from "@/components/pdf/utils/PDFGenerationUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";

interface ExportButtonProps {
  data: {
    responses: {
      general: any[];
      lifeSupport: any[];
      advancedIllness: any[];
      preferences: any[];
    };
    synthesis?: {
      free_text: string;
    } | null;
    userId: string;
  };
}

export function ExportButton({ data }: ExportButtonProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, trustedPersons } = usePDFData();
  
  if (!data) return null;

  const handleExport = async () => {
    setIsGenerating(true);
    
    if (!profile) {
      console.error("[ExportButton] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }
    
    // Make sure to combine the synthesis with the responses
    const fullResponses = {
      ...data.responses,
      synthesis: data.synthesis || null
    };
    
    console.log("[ExportButton] Starting PDF generation with full data");
    console.log("[ExportButton] Has synthesis:", data.synthesis ? "Yes" : "No");
    
    try {
      await handlePDFGeneration(
        profile,
        fullResponses,
        trustedPersons,
        (url) => {
          setPdfUrl(url);
          setIsGenerating(false);
          
          if (url) {
            // Store a backup in localStorage
            try {
              localStorage.setItem(`pdf_${data.userId}`, url);
              console.log("[ExportButton] PDF URL saved to localStorage");
            } catch (e) {
              console.warn("[ExportButton] Could not save PDF to localStorage:", e);
            }
            
            // Show preview dialog
            console.log("[ExportButton] Opening preview dialog");
            setShowPreview(true);
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de générer le PDF.",
              variant: "destructive",
            });
          }
        },
        () => {} // We're handling preview separately
      );
    } catch (error) {
      console.error("[ExportButton] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
      setShowPreview(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="default" 
        className="w-full mt-4" 
        disabled={isGenerating}
        onClick={handleExport}
      >
        {isGenerating ? t('generatingPDF') : t('exportPDF')}
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onSave={handleDownload}
      />
    </>
  );
}

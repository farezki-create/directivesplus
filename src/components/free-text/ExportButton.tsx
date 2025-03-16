
import { Button } from "@/components/ui/button";
import { handlePDFGeneration, handlePDFDownload } from "@/components/pdf/utils/PDFGenerationUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
    
    try {
      await handlePDFGeneration(
        profile,
        data.responses,
        trustedPersons,
        (url) => {
          setPdfUrl(url);
          if (url) {
            handlePDFDownload(url);
            toast({
              title: "Succès",
              description: "Le PDF a été généré et téléchargé avec succès.",
            });
          }
          setIsGenerating(false);
        },
        () => {
          setIsGenerating(false);
        }
      );
    } catch (error) {
      console.error("[ExportButton] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="default" 
      className="w-full mt-4" 
      disabled={isGenerating}
      onClick={handleExport}
    >
      {isGenerating ? t('generatingPDF') : t('exportPDF')}
    </Button>
  );
}

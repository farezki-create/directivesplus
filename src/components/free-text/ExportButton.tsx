
import { Button } from "@/components/ui/button";
import { handlePDFGeneration, handlePDFDownload } from "@/components/pdf/utils/PDFGenerationUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useState } from "react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { profile, trustedPersons } = usePDFData();
  
  if (!data) return null;

  const handleExport = async () => {
    setIsGenerating(true);
    
    if (!profile) {
      console.error("[ExportButton] No profile data available");
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
          }
          setIsGenerating(false);
        },
        () => {}
      );
    } catch (error) {
      console.error("[ExportButton] Error generating PDF:", error);
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

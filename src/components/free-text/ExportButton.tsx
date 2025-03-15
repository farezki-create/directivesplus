
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";

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
  const { profile, trustedPersons } = usePDFData();
  const {
    pdfUrl,
    showPreview,
    setShowPreview,
    isGenerating,
    generatePDF,
    handleDownload
  } = usePDFGeneration();
  
  if (!data) return null;

  const handleExport = async () => {
    if (!profile) {
      console.error("[ExportButton] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure to combine the synthesis with the responses
    const fullResponses = {
      ...data.responses,
      synthesis: data.synthesis || null
    };
    
    console.log("[ExportButton] Starting PDF generation with full data");
    console.log("[ExportButton] Has synthesis:", data.synthesis ? "Yes" : "No");
    
    await generatePDF(profile, fullResponses, trustedPersons, {
      saveToStorage: true,
      onSuccess: (url) => {
        // Store a backup in localStorage
        try {
          localStorage.setItem(`pdf_${data.userId}`, url);
          console.log("[ExportButton] PDF URL saved to localStorage");
        } catch (e) {
          console.warn("[ExportButton] Could not save PDF to localStorage:", e);
        }
      }
    });
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

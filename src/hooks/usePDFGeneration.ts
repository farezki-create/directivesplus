import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";

export function usePDFGeneration(userId: string | null, text: string) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { responses } = useQuestionnairesResponses(userId || "");

  const generatePDF = async () => {
    try {
      console.log("[PDFGeneration] Generating PDF");
      
      if (!userId) {
        console.error("[PDFGeneration] No user ID provided");
        throw new Error("User ID is required");
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("[PDFGeneration] Error fetching profile:", profileError);
        throw profileError;
      }

      // Generate PDF with all responses
      const pdfDataUrl = PDFDocumentGenerator.generate(
        profile,
        {
          ...responses,
          synthesis: { free_text: text }
        },
        []
      );
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);

      console.log("[PDFGeneration] PDF generated successfully");
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error("[PDFGeneration] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  const handleEmail = async () => {
    // Email handling logic here
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'synthese-directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    pdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handlePrint,
    handleEmail,
    handleDownload
  };
}
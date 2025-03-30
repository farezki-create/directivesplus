
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useSynthesis } from "@/hooks/useSynthesis";
import { usePDFStorage } from "@/hooks/usePDFStorage";
import { supabase } from "@/integrations/supabase/client";
import { PDFGenerationService } from "@/utils/PDFGenerationService";

export function usePDFGeneration(userId: string | null, text?: string) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { responses, synthesis } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);
  const { 
    isTransferringToCloud,
    externalDocumentId,
    saveToExternalStorage,
    syncToExternalStorage: syncToStorage,
    retrieveExternalDocument
  } = usePDFStorage(userId);

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

      // Fetch trusted persons
      const { data: trustedPersons, error: trustedPersonsError } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', userId);

      if (trustedPersonsError) {
        console.error("[PDFGeneration] Error fetching trusted persons:", trustedPersonsError);
        // Continue without trusted persons
      }

      // Use the passed text parameter if provided, otherwise use the synthesis text from database
      const synthesisText = text || freeText || synthesis?.free_text || "";

      // Generate PDF
      const pdfDataUrl = await PDFGenerationService.generatePDF(
        userId,
        profile,
        {
          ...responses,
          synthesis: { free_text: synthesisText }
        },
        trustedPersons || []
      );
      
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);

      // Save to external storage
      if (pdfDataUrl && profile) {
        await saveToExternalStorage(pdfDataUrl, profile);
      }

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

  const syncToExternalStorage = async () => {
    return syncToStorage(pdfUrl);
  };

  const handlePrint = () => {
    PDFGenerationService.handlePrint(pdfUrl);
  };

  const handleEmail = async () => {
    // Email handling logic here - can be moved to PDFGenerationService in the future
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
    handleDownload,
    externalDocumentId,
    retrieveExternalDocument,
    syncToExternalStorage,
    isTransferringToCloud
  };
}

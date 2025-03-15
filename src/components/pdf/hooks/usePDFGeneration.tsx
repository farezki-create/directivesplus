
import { useState, useEffect } from 'react';
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { toast } from "@/hooks/use-toast";
import { handlePDFGeneration, handlePDFDownload } from "../utils/PDFGenerationUtils";
import { TextDocumentGenerator } from "../utils/TextDocumentGenerator";

export function usePDFGeneration(userId: string) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFailed, setGenerationFailed] = useState(false);
  const { responses, synthesis } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  // Check if we have a cached PDF in localStorage
  useEffect(() => {
    if (userId && !pdfUrl) {
      try {
        const cachedPdf = localStorage.getItem(`pdf_${userId}`);
        if (cachedPdf && (cachedPdf.startsWith('data:') || cachedPdf.startsWith('http'))) {
          console.log("[PDFGenerator] Found cached PDF in localStorage");
          setPdfUrl(cachedPdf);
        }
      } catch (e) {
        console.warn("[PDFGenerator] Could not read from localStorage:", e);
      }
    }
  }, [userId, pdfUrl]);

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setGenerationFailed(false);
    setTextContent(null);
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      handlePDFGeneration(
        profile,
        responses,
        trustedPersons,
        (url) => {
          console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
          
          // Display detailed error if no URL was returned
          if (!url) {
            setGenerationFailed(true);
            toast({
              title: "Erreur",
              description: "Impossible de générer le PDF. Veuillez vérifier votre connexion internet.",
              variant: "destructive",
            });
          }
          
          setPdfUrl(url);
          setIsGenerating(false);
        },
        setShowPreview
      );
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
    }
  };

  const generateTextDocument = () => {
    console.log("[PDFGenerator] Generating text document");
    setIsGenerating(true);
    setGenerationFailed(false);
    setPdfUrl(null);
    
    try {
      // Generate the text document
      const textDoc = TextDocumentGenerator.generate(
        profile,
        responses,
        synthesis,
        trustedPersons
      );
      
      // Store the text content
      setTextContent(textDoc);
      
      // Show preview
      setShowPreview(true);
      
      // Success notification
      toast({
        title: "Succès",
        description: "Le document texte a été généré avec succès.",
      });
      
    } catch (error) {
      console.error("[PDFGenerator] Error generating text document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document texte.",
        variant: "destructive",
      });
      setGenerationFailed(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
    }
  };

  return {
    pdfUrl,
    textContent,
    showPreview,
    setShowPreview,
    isGenerating,
    generationFailed,
    generatePDF,
    generateTextDocument,
    downloadPDF,
    loading
  };
}

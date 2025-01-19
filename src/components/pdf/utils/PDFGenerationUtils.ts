import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";

export const handlePDFGeneration = (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation");
    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Profile data is required");
    }

    // Generate PDF
    const pdfDataUrl = PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("PDF generation failed");
    }

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

export const handlePDFDownload = (pdfUrl: string | null, fileName: string = 'synthese-directives-anticipees.pdf') => {
  if (!pdfUrl) {
    console.error("[PDFGeneration] No PDF URL available for download");
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("[PDFGeneration] PDF downloaded successfully");
  } catch (error) {
    console.error("[PDFGeneration] Error downloading PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
};

export const handlePDFPrint = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    console.error("[PDFGeneration] No PDF URL available for printing");
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le PDF.",
      variant: "destructive",
    });
    return;
  }

  try {
    const printWindow = window.open(pdfUrl);
    if (!printWindow) {
      throw new Error("Could not open print window");
    }
    printWindow.print();
    console.log("[PDFGeneration] Print window opened successfully");
  } catch (error) {
    console.error("[PDFGeneration] Error opening print window:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le PDF.",
      variant: "destructive",
    });
  }
};
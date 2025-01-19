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
  if (pdfUrl) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const handlePDFPrint = (pdfUrl: string | null) => {
  if (pdfUrl) {
    const printWindow = window.open(pdfUrl);
    printWindow?.print();
  }
};
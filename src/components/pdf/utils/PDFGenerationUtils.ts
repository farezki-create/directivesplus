
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";

export const handlePDFGeneration = async (
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
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", profile);
    console.log("[PDFGeneration] Responses data:", responses);

    // Generate PDF
    const pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("La génération du PDF a échoué");
    }

    console.log("[PDFGeneration] PDF generated successfully, data URL length:", pdfDataUrl.length);
    
    // Ensure the PDF data URL starts with the correct prefix
    if (!pdfDataUrl.startsWith('data:application/pdf;base64,')) {
      console.error("[PDFGeneration] Invalid PDF data URL format");
      throw new Error("Format de PDF invalide");
    }
    
    setPdfUrl(pdfDataUrl);
    setShowPreview(true);

    toast({
      title: "Succès",
      description: "Le PDF a été généré avec succès.",
    });
  } catch (error) {
    console.error("[PDFGeneration] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
  }
};

export const handlePDFDownload = (pdfUrl: string | null) => {
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
    link.download = 'directives-anticipees.pdf';
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error("Impossible d'ouvrir la fenêtre d'impression");
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression des directives anticipées</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            }
          </script>
        </head>
        <body>
          <iframe src="${pdfUrl}" width="100%" height="100%"></iframe>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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

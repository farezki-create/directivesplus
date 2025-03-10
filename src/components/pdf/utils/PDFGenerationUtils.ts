
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { revokePdfUrl } from "./PrintUtils";

export const handlePDFGeneration = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation");
    
    // Afficher un message de chargement
    toast({
      title: "Génération en cours",
      description: "Création de votre document PDF...",
    });

    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", profile);
    console.log("[PDFGeneration] Responses data:", responses);

    // Révoquer l'ancien URL si nécessaire
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      revokePdfUrl(pdfUrl);
    }

    // Generate PDF
    const pdfUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    
    if (!pdfUrl) {
      console.error("[PDFGeneration] PDF generation failed - no URL returned");
      throw new Error("La génération du PDF a échoué");
    }

    console.log("[PDFGeneration] Generated PDF URL:", pdfUrl.substring(0, 30) + "...");
    
    setPdfUrl(pdfUrl);
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
    console.log("[PDFGeneration] Starting PDF download");
    
    // Créer un élément a temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'directives-anticipees.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("[PDFGeneration] PDF downloaded successfully");
    
    toast({
      title: "Succès",
      description: "Le PDF a été téléchargé.",
    });
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
    console.log("[PDFGeneration] Opening print window");
    const printWindow = createPrintWindow(pdfUrl);
    if (!printWindow) {
      throw new Error("Impossible d'ouvrir la fenêtre d'impression");
    }
    console.log("[PDFGeneration] Print window opened successfully");
  } catch (error) {
    console.error("[PDFGeneration] Error opening print window:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le PDF. Vérifiez que les popups ne sont pas bloqués.",
      variant: "destructive",
    });
  }
};

// Fonction pour nettoyer les ressources lors de la fermeture
export const cleanupPDFResources = (pdfUrl: string | null) => {
  if (pdfUrl && pdfUrl.startsWith('blob:')) {
    revokePdfUrl(pdfUrl);
  }
};

// Import depuis PrintUtils.ts
import { createPrintWindow } from "./PrintUtils";

// Variable pour stocker l'URL actuel du PDF (pour nettoyage)
let pdfUrl: string | null = null;

import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";

export const handlePDFGeneration = (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF sans vos informations de profil.",
        variant: "destructive",
      });
      return;
    }

    console.log("[PDFGenerator] Generating PDF with data:", { profile, responses, trustedPersons });
    const pdfDataUrl = PDFDocumentGenerator.generate(profile, responses, trustedPersons);
    console.log("[PDFGenerator] PDF generated successfully");
    setPdfUrl(pdfDataUrl);
    setShowPreview(true);
    
    toast({
      title: "Succès",
      description: "Le PDF a été généré avec succès.",
    });

  } catch (error) {
    console.error("[PDFGenerator] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF.",
      variant: "destructive",
    });
  }
};

export const handlePDFSave = (pdfUrl: string | null) => {
  try {
    if (!pdfUrl) {
      console.error("[PDFGenerator] No PDF URL available for saving");
      toast({
        title: "Erreur",
        description: "Aucun PDF n'a été généré.",
        variant: "destructive",
      });
      return;
    }

    console.log("[PDFGenerator] Saving PDF");
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = "directives-anticipees.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("[PDFGenerator] PDF downloaded successfully");
  } catch (error) {
    console.error("[PDFGenerator] Error saving PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le PDF.",
      variant: "destructive",
    });
  }
};

export const handlePDFPrint = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    console.error("[PDFGenerator] No PDF URL available for printing");
    toast({
      title: "Erreur",
      description: "Aucun PDF n'a été généré pour l'impression.",
      variant: "destructive",
    });
    return;
  }

  const printWindow = window.open(pdfUrl);
  if (printWindow) {
    printWindow.print();
  } else {
    console.error("[PDFGenerator] Could not open print window");
    toast({
      title: "Erreur",
      description: "Impossible d'ouvrir la fenêtre d'impression.",
      variant: "destructive",
    });
  }
};

export const handlePDFEmail = async (email: string | undefined, pdfUrl: string | null) => {
  if (!email) {
    toast({
      title: "Erreur",
      description: "Aucune adresse email associée à votre profil.",
      variant: "destructive",
    });
    return;
  }

  if (!pdfUrl) {
    toast({
      title: "Erreur",
      description: "Aucun PDF n'a été généré.",
      variant: "destructive",
    });
    return;
  }

  try {
    console.log("[PDFGenerator] Sending PDF by email to:", email);
    const response = await fetch('/api/send-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        pdfUrl,
      }),
    });

    if (response.ok) {
      console.log("[PDFGenerator] PDF sent successfully by email");
      toast({
        title: "Succès",
        description: "Le PDF a été envoyé par email.",
      });
    } else {
      throw new Error("Erreur lors de l'envoi de l'email");
    }
  } catch (error) {
    console.error("[PDFGenerator] Error sending PDF by email:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'envoyer le PDF par email.",
      variant: "destructive",
    });
  }
};
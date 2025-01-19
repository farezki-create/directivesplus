import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { usePDFData } from "./usePDFData";
import { PDFDocumentGenerator } from "./PDFDocumentGenerator";

export const PDFGenerator = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { profile, responses, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
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
      console.log("[PDFGenerator] PDF generated successfully, setting URL:", pdfDataUrl.substring(0, 100) + "...");
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

  useEffect(() => {
    if (!loading && profile) {
      console.log("[PDFGenerator] Auto-generating PDF on mount");
      generatePDF();
    }
  }, [loading, profile]);

  const handleSave = () => {
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

      console.log("[PDFGenerator] Saving PDF with URL:", pdfUrl.substring(0, 100) + "...");
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

  const handlePrint = () => {
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

  const handleEmail = async () => {
    if (!profile?.email) {
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
      console.log("[PDFGenerator] Sending PDF by email to:", profile.email);
      const response = await fetch('/api/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          pdfUrl: pdfUrl,
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Générer vos documents</h2>
      <p className="text-muted-foreground mb-6">
        Téléchargez vos directives anticipées et la liste des personnes de confiance au format PDF.
      </p>
      <Button onClick={generatePDF} className="w-full">
        Générer Directives anticipées et personne de confiance
      </Button>

      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onEmail={handleEmail}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </Card>
  );
};
import { useState } from "react";
import { jsPDF } from "jspdf";
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
        toast({
          title: "Erreur",
          description: "Impossible de générer le PDF sans vos informations de profil.",
          variant: "destructive",
        });
        return;
      }

      const pdfDataUrl = PDFDocumentGenerator.generate(profile, responses, trustedPersons);
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);
      
      console.log("[PDFGenerator] PDF generated successfully");
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

  const handleSave = () => {
    const doc = new jsPDF();
    doc.save("directives-anticipees.pdf");
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
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

    try {
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
        toast({
          title: "Succès",
          description: "Le PDF a été envoyé par email.",
        });
      } else {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
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
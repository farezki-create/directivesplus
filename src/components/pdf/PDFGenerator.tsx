import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { usePDFData } from "./usePDFData";
import { 
  handlePDFGeneration,
  handlePDFSave,
  handlePDFPrint,
  handlePDFEmail
} from "./utils/PDFGenerationUtils";

export const PDFGenerator = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, responses, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    handlePDFGeneration(profile, responses, trustedPersons, setPdfUrl, setShowPreview);
  };

  useEffect(() => {
    if (!loading && profile) {
      console.log("[PDFGenerator] Auto-generating PDF on mount");
      generatePDF();
    }
  }, [loading, profile]);

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
        onEmail={() => handlePDFEmail(profile?.email, pdfUrl)}
        onSave={() => handlePDFSave(pdfUrl)}
        onPrint={() => handlePDFPrint(pdfUrl)}
      />
    </Card>
  );
};
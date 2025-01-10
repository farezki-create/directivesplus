import { Button } from "./ui/button";
import { Card } from "./ui/card";

export const PDFGenerator = () => {
  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Générer vos documents</h2>
      <p className="text-muted-foreground mb-6">
        Téléchargez vos directives anticipées et la liste des personnes de confiance au format PDF.
      </p>
      <Button onClick={generatePDF} className="w-full">
        Générer le PDF
      </Button>
    </Card>
  );
};
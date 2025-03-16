
import { Separator } from "@/components/ui/separator";
import { PDFGenerator } from "@/components/PDFGenerator";

interface PDFGenerationSectionProps {
  userId: string;
  hasReviewed: boolean;
  isLoading: boolean;
  onPdfGenerated: (url: string | null) => void;
}

export function PDFGenerationSection({ 
  userId, 
  hasReviewed, 
  isLoading,
  onPdfGenerated
}: PDFGenerationSectionProps) {
  if (!hasReviewed || isLoading) {
    return <Separator />;
  }

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Générer mon document</h3>
        <p className="text-gray-600">
          Vos directives anticipées sont prêtes à être générées. Cliquez sur le bouton ci-dessous pour créer votre document PDF.
        </p>
        <PDFGenerator userId={userId} onPdfGenerated={onPdfGenerated} />
      </div>
    </>
  );
}

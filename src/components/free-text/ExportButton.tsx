
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { usePDFData } from "@/components/pdf/usePDFData";
import { PDFGenerator } from "@/components/PDFGenerator";

interface ExportButtonProps {
  data: {
    responses: {
      general: any[];
      lifeSupport: any[];
      advancedIllness: any[];
      preferences: any[];
    };
    synthesis?: {
      free_text: string;
    } | null;
    userId: string;
  };
}

export function ExportButton({ data }: ExportButtonProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCard, setIsCard] = useState<boolean>(false);
  const [showGenerator, setShowGenerator] = useState<boolean>(false);

  const handleDirectivesClick = () => {
    setIsCard(false);
    setShowGenerator(true);
  };

  const handleCardClick = () => {
    setIsCard(true);
    setShowGenerator(true);
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="default" 
        className="w-full mt-4 flex items-center gap-2"
        onClick={handleDirectivesClick}
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      <Button 
        variant="outline" 
        size="default" 
        className="w-full flex items-center gap-2"
        onClick={handleCardClick}
      >
        <CreditCard className="h-4 w-4" />
        Générer ma carte d'accès
      </Button>
      
      {showGenerator && data.userId && (
        <PDFGenerator
          userId={data.userId}
          onPdfGenerated={setPdfUrl}
          synthesisText={data.synthesis?.free_text}
          isCard={isCard}
        />
      )}
    </div>
  );
}

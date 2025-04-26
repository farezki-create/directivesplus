
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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

  return (
    <div>
      <Button 
        variant="outline" 
        size="default" 
        className="w-full mt-4 flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      {data.userId && (
        <PDFGenerator
          userId={data.userId}
          onPdfGenerated={setPdfUrl}
          synthesisText={data.synthesis?.free_text}
        />
      )}
    </div>
  );
}

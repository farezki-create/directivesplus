
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { usePDFData } from "@/components/pdf/usePDFData";
import { PDFGenerator } from "@/components/PDFGenerator";
import { useNavigate } from "react-router-dom";

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
  const [showGenerator, setShowGenerator] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDirectivesClick = () => {
    navigate("/generate-pdf");
  };

  const handleCardClick = () => {
    navigate("/generate-pdf?format=card");
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
    </div>
  );
}

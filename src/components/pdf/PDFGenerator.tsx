
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const { loading } = usePDFData();
  const navigate = useNavigate();

  const navigateToPDFGeneration = () => {
    navigate("/generate-pdf");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <Button 
        onClick={navigateToPDFGeneration}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
    </div>
  );
}

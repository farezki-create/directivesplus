
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
    <Button 
      onClick={navigateToPDFGeneration}
      className="flex items-center gap-3 h-auto py-4 w-full transition-all"
    >
      <div className="bg-blue-100 p-2 rounded-full">
        <FileText className="h-5 w-5 text-blue-600" />
      </div>
      <div className="text-left">
        <div className="font-medium">Générer Mes directives anticipées</div>
        <div className="text-sm text-muted-foreground">
          Document complet avec toutes vos préférences médicales
        </div>
      </div>
    </Button>
  );
}

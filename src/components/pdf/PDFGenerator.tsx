
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({
  userId
}: PDFGeneratorProps) {
  const {
    loading
  } = usePDFData();
  const navigate = useNavigate();
  
  const navigateToPDFGeneration = (isCard: boolean = false) => {
    const url = isCard ? "/generate-pdf?format=card" : "/generate-pdf";
    navigate(url);
  };
  
  if (loading) {
    return null;
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Button 
        onClick={() => navigateToPDFGeneration(false)} 
        className="flex items-center gap-3 h-auto py-4 w-full transition-all mx-0 text-xs"
      >
        <div className="bg-blue-100 p-2 rounded-full">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="font-medium">Générer Mes directives anticipées</div>
        </div>
      </Button>
      
      <Button 
        onClick={() => navigateToPDFGeneration(true)} 
        className="flex items-center gap-3 h-auto py-4 w-full transition-all mx-0 text-xs"
      >
        <div className="bg-purple-100 p-2 rounded-full">
          <CreditCard className="h-5 w-5 text-purple-600" />
        </div>
        <div className="text-left">
          <div className="font-medium">Générer ma carte d'accès</div>
        </div>
      </Button>
    </div>
  );
}

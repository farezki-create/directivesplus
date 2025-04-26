
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PDFGenerationOverlay } from "./PDFGenerationOverlay";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const { loading } = usePDFData();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      navigate("/my-documents");
    }, 2000);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {isGenerating && (
        <PDFGenerationOverlay 
          isGenerating={true}
          progress={75}
          waitingMessage="Génération et sauvegarde de vos directives anticipées..."
        />
      )}
      
      <Button 
        onClick={handleGenerate}
        className="flex items-center gap-3 h-auto py-4 w-full transition-all bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div className="text-left text-white">
          <div className="font-medium">Générer et enregistrer mes directives anticipées</div>
          <div className="text-sm opacity-90">
            Sauvegarder dans mes documents
          </div>
        </div>
      </Button>
    </>
  );
}

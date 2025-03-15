
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { TextDocumentGenerator } from "./utils/TextDocumentGenerator";
import { useToast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { responses, synthesis } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();
  const { toast } = useToast();

  const generateTextDocument = () => {
    console.log("[PDFGenerator] Starting text document generation with profile:", profile);
    
    try {
      // Generate the text document
      const generatedText = TextDocumentGenerator.generate(
        profile,
        responses,
        synthesis,
        trustedPersons
      );
      
      if (!generatedText) {
        throw new Error("Le document généré est vide");
      }
      
      setTextContent(generatedText);
      setShowPreview(true);
      
      toast({
        title: "Succès",
        description: "Document texte généré avec succès",
      });
    } catch (error) {
      console.error("[PDFGenerator] Error generating text document:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du document texte",
        variant: "destructive",
      });
    }
  };

  const handleEmail = async () => {
    console.log("[PDFGenerator] Email functionality not yet implemented");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <Button 
        onClick={generateTextDocument}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        textContent={textContent}
        onSave={() => {}}
      />
    </div>
  );
}

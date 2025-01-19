import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { PDFGenerator } from "../PDFGenerator";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { ResponseSection } from "./ResponseSection";
import { formatResponses } from "./ResponseFormatter";

interface FreeTextInputProps {
  userId: string | null;
}

export function FreeTextInput({ userId }: FreeTextInputProps) {
  const navigate = useNavigate();
  const { responses } = useQuestionnairesResponses(userId || "");
  const {
    pdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handlePrint,
    handleEmail,
    handleDownload
  } = usePDFGeneration(userId, "");

  return (
    <div className="mb-8">
      <div className="mb-6 space-y-6">
        <ResponseSection 
          title="Mon avis d'une façon générale" 
          items={formatResponses(responses.general)} 
        />
        <ResponseSection 
          title="Maintien en vie" 
          items={formatResponses(responses.lifeSupport)} 
        />
        <ResponseSection 
          title="Maladie avancée" 
          items={formatResponses(responses.advancedIllness)} 
        />
        <ResponseSection 
          title="Mes goûts et mes peurs" 
          items={formatResponses(responses.preferences)} 
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <div className="flex gap-4">
          {userId && <PDFGenerator userId={userId} />}
        </div>
      </div>

      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onEmail={handleEmail}
        onSave={handleDownload}
        onPrint={handlePrint}
      />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { useSynthesis } from "@/hooks/useSynthesis";
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
  const { text, setText, saveSynthesis } = useSynthesis(userId);
  const {
    pdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handlePrint,
    handleEmail,
    handleDownload
  } = usePDFGeneration(userId, text);

  const handleSave = async () => {
    console.log("[FreeText] Attempting to save synthesis and generate PDF");
    const success = await saveSynthesis();
    if (success) {
      console.log("[FreeText] Synthesis saved successfully, generating PDF");
      await generatePDF();
      console.log("[FreeText] PDF generated successfully");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
      <p className="text-muted-foreground mb-4">
        Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
      </p>

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

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez ici..."
        className="min-h-[200px] mb-6"
      />

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <div className="flex gap-4">
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
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
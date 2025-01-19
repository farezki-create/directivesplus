import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { useSynthesis } from "@/hooks/useSynthesis";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";

interface FreeTextInputProps {
  userId: string | null;
}

export function FreeTextInput({ userId }: FreeTextInputProps) {
  const navigate = useNavigate();
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
      console.log("[FreeText] PDF generated successfully, navigating to Documents");
      navigate("/examples");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
      <p className="text-muted-foreground mb-4">
        Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez ici..."
        className="min-h-[200px] mb-6"
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <Button onClick={handleSave}>
          Enregistrer
        </Button>
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
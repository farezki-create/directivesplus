import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { useSynthesis } from "@/hooks/useSynthesis";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { PDFGenerator } from "../PDFGenerator";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";

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

  const formatResponseText = (response: string) => {
    switch (response) {
      case 'je_ne_sais_pas':
        return 'je ne sais pas';
      case 'oui_durée_modérée':
      case 'oui_duree_moderee':
      case 'oui_duree_moderée':
        return 'oui pour une durée modérée';
      case 'oui_médical':
        return 'oui seulement si l\'équipe médicale le juge utile';
      default:
        return response;
    }
  };

  const formatResponses = (responseArray: any[]) => {
    if (!responseArray || responseArray.length === 0) {
      return [];
    }

    return responseArray.map(response => ({
      question: response.question_text || 
                response.questions?.Question || 
                response.life_support_questions?.question ||
                response.advanced_illness_questions?.question ||
                response.preferences_questions?.question,
      response: formatResponseText(response.response)
    }));
  };

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
        {responses.general.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Mon avis d'une façon générale</h3>
            {formatResponses(responses.general).map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm">{item.question}</p>
                <p className="text-lg font-semibold text-primary">{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.lifeSupport.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Maintien en vie</h3>
            {formatResponses(responses.lifeSupport).map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm">{item.question}</p>
                <p className="text-lg font-semibold text-primary">{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.advancedIllness.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Maladie avancée</h3>
            {formatResponses(responses.advancedIllness).map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm">{item.question}</p>
                <p className="text-lg font-semibold text-primary">{item.response}</p>
              </div>
            ))}
          </div>
        )}

        {responses.preferences.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Mes goûts et mes peurs</h3>
            {formatResponses(responses.preferences).map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm">{item.question}</p>
                <p className="text-lg font-semibold text-primary">{item.response}</p>
              </div>
            ))}
          </div>
        )}
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
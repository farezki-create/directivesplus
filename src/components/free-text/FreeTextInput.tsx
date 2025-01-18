import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PDFDocumentGenerator } from "../pdf/PDFDocumentGenerator";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";

interface FreeTextInputProps {
  userId: string | null;
}

export function FreeTextInput({ userId }: FreeTextInputProps) {
  const [text, setText] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { responses } = useQuestionnairesResponses(userId || "");

  useEffect(() => {
    const loadSynthesis = async () => {
      if (!userId) return;

      try {
        console.log("[FreeTextInput] Loading existing synthesis");
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error loading synthesis:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[FreeTextInput] Loaded existing synthesis");
          setText(data.free_text);
        } else {
          console.log("[FreeTextInput] No existing synthesis found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Error loading synthesis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre synthèse existante.",
          variant: "destructive",
        });
      }
    };

    loadSynthesis();
  }, [userId, toast]);

  const generatePDF = async () => {
    try {
      console.log("[FreeTextInput] Generating PDF");
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Generate PDF with all responses
      const pdfDataUrl = PDFDocumentGenerator.generate(
        profile,
        {
          ...responses,
          synthesis: { free_text: text }
        },
        []
      );
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);

      console.log("[FreeTextInput] PDF generated successfully");
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error("[FreeTextInput] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!userId) {
      console.log("[FreeTextInput] No user ID found, cannot save");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("[FreeTextInput] Saving synthesis text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: text
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("[FreeTextInput] Error saving synthesis:", error);
        throw error;
      }

      console.log("[FreeTextInput] Synthesis saved successfully");
      toast({
        title: "Succès",
        description: "Votre synthèse a été enregistrée.",
      });

      // Generate PDF after successful save
      await generatePDF();
    } catch (error) {
      console.error("[FreeTextInput] Error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  const handleEmail = async () => {
    // Email handling logic here
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'synthese-directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PenTool } from "lucide-react";
import { PDFGenerator } from "@/components/PDFGenerator";
import { SignatureDialog } from "@/components/signature/SignatureDialog";

interface DocumentActionsProps {
  userId: string;
  freeText: string;
  showPdfGenerator: boolean;
  setShowPdfGenerator: (show: boolean) => void;
}

export const DocumentActions = ({ 
  userId, 
  freeText, 
  showPdfGenerator, 
  setShowPdfGenerator 
}: DocumentActionsProps) => {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const { toast } = useToast();

  const saveFreeText = async () => {
    try {
      console.log("[DocumentActions] Saving free text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert(
          {
            user_id: userId,
            free_text: freeText
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error("[DocumentActions] Error saving free text:", error);
        throw error;
      }

      console.log("[DocumentActions] Free text saved successfully");
      toast({
        title: "Succès",
        description: "Votre texte libre a été enregistré avec succès.",
      });
      
      setShowPdfGenerator(true);
    } catch (error) {
      console.error("[DocumentActions] Error saving free text:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre texte libre.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Button onClick={saveFreeText}>Enregistrer</Button>
      </div>
      
      {showPdfGenerator && (
        <div className="mt-4 space-y-4">
          <Button 
            onClick={() => setShowSignatureDialog(true)}
            className="flex items-center gap-2"
          >
            <PenTool className="h-4 w-4" />
            Signer le document
          </Button>
          <PDFGenerator userId={userId} />
        </div>
      )}

      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        userId={userId}
      />
    </>
  );
};

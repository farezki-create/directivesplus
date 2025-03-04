
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SpeechRecognition } from "./SpeechRecognition";
import { DocumentActions } from "./DocumentActions";

interface FreeTextInputProps {
  userId: string;
}

export const FreeTextInput = ({ userId }: FreeTextInputProps) => {
  const [freeText, setFreeText] = useState("");
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadFreeText = async () => {
      try {
        console.log("[FreeTextInput] Loading existing free text for userId:", userId);
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error loading free text:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[FreeTextInput] Loaded existing free text");
          setFreeText(data.free_text);
        } else {
          console.log("[FreeTextInput] No existing free text found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Error loading free text:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre texte libre existant.",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      loadFreeText();
    }
  }, [userId, toast]);

  const handleTranscriptReceived = (transcript: string) => {
    setFreeText(prev => prev + ' ' + transcript);
  };

  const { isListening, ButtonComponent } = SpeechRecognition({ 
    onTranscriptReceived: handleTranscriptReceived 
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Texte libre</h3>
      <div className="relative">
        <Textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          className="min-h-[100px] border-dotted pr-12"
          placeholder="Écrivez ou dictez votre texte libre ici..."
        />
        {ButtonComponent}
      </div>
      
      <DocumentActions 
        userId={userId}
        freeText={freeText}
        showPdfGenerator={showPdfGenerator}
        setShowPdfGenerator={setShowPdfGenerator}
      />
    </div>
  );
};

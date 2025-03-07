
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VoiceRecorder } from "./VoiceRecorder";

interface TextEditorProps {
  userId: string;
  onSaved: () => void;
}

export const TextEditor = ({ userId, onSaved }: TextEditorProps) => {
  const [freeText, setFreeText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadFreeText = async () => {
      try {
        console.log("[TextEditor] Loading existing free text for userId:", userId);
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[TextEditor] Error loading free text:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[TextEditor] Loaded existing free text");
          setFreeText(data.free_text);
        } else {
          console.log("[TextEditor] No existing free text found");
        }
      } catch (error) {
        console.error("[TextEditor] Error loading free text:", error);
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

  const saveFreeText = async () => {
    try {
      console.log("[TextEditor] Saving free text");
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
        console.error("[TextEditor] Error saving free text:", error);
        throw error;
      }

      console.log("[TextEditor] Free text saved successfully");
      toast({
        title: "Succès",
        description: "Votre texte libre a été enregistré avec succès.",
      });
      
      onSaved();
    } catch (error) {
      console.error("[TextEditor] Error saving free text:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre texte libre.",
        variant: "destructive",
      });
    }
  };

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
        <VoiceRecorder onTranscriptReceived={handleTranscriptReceived} />
      </div>
      <div className="flex gap-2 items-center">
        <Button onClick={saveFreeText}>Enregistrer</Button>
      </div>
    </div>
  );
};

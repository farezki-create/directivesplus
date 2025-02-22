
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PDFGenerator } from "@/components/PDFGenerator";

interface FreeTextInputProps {
  userId: string;
}

export const FreeTextInput = ({ userId }: FreeTextInputProps) => {
  const [freeText, setFreeText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadFreeText = async () => {
      try {
        console.log("[FreeTextInput] Loading existing free text");
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

  const saveFreeText = async () => {
    try {
      console.log("[FreeTextInput] Saving free text");
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
        console.error("[FreeTextInput] Error saving free text:", error);
        throw error;
      }

      console.log("[FreeTextInput] Free text saved successfully");
      toast({
        title: "Succès",
        description: "Votre texte libre a été enregistré avec succès.",
      });
    } catch (error) {
      console.error("[FreeTextInput] Error saving free text:", error);
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
      <Textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        className="min-h-[100px] border-dotted"
        placeholder="Écrivez votre texte libre ici..."
      />
      <div className="flex gap-4">
        <Button onClick={saveFreeText}>Enregistrer</Button>
        <PDFGenerator userId={userId} />
        <PDFGenerator userId={userId} isCardFormat={true} />
      </div>
    </div>
  );
};

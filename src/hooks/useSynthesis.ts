import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSynthesis(userId: string | null) {
  const [text, setText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadSynthesis = async () => {
      if (!userId) return;

      try {
        console.log("[Synthesis] Loading existing synthesis");
        const { data, error } = await supabase
          .from('questionnaire_synthesis')
          .select('free_text')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error("[Synthesis] Error loading synthesis:", error);
          throw error;
        }

        if (data?.free_text) {
          console.log("[Synthesis] Loaded existing synthesis");
          setText(data.free_text);
        } else {
          console.log("[Synthesis] No existing synthesis found");
        }
      } catch (error) {
        console.error("[Synthesis] Error loading synthesis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre synthèse existante.",
          variant: "destructive",
        });
      }
    };

    loadSynthesis();
  }, [userId, toast]);

  const saveSynthesis = async () => {
    if (!userId) {
      console.log("[Synthesis] No user ID found, cannot save");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("[Synthesis] Saving synthesis text");
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: text
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("[Synthesis] Error saving synthesis:", error);
        throw error;
      }

      console.log("[Synthesis] Synthesis saved successfully");
      toast({
        title: "Succès",
        description: "Votre synthèse a été enregistrée.",
      });

      return true;
    } catch (error) {
      console.error("[Synthesis] Error during save:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    text,
    setText,
    saveSynthesis
  };
}
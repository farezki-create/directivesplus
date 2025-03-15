
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useSynthesis(userId: string | null) {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSynthesis = async () => {
      if (!userId) {
        console.log("[Synthesis] No user ID, skipping load");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("[Synthesis] Loading existing synthesis for user:", userId);
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
          console.log("[Synthesis] Loaded existing synthesis, length:", data.free_text.length);
          setText(data.free_text);
        } else {
          console.log("[Synthesis] No existing synthesis found");
          setText(""); // Ensure text is empty when no synthesis exists
        }
      } catch (error) {
        console.error("[Synthesis] Error loading synthesis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre synthèse existante.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
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
      return false;
    }

    if (isSaving) {
      console.log("[Synthesis] Save already in progress, ignoring request");
      return false;
    }

    try {
      setIsSaving(true);
      console.log("[Synthesis] Saving synthesis text for user:", userId);
      console.log("[Synthesis] Text length:", text.length);
      
      // First check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('questionnaire_synthesis')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("[Synthesis] Error checking existing record:", checkError);
        throw checkError;
      }
      
      let saveError;
      
      if (existingRecord) {
        // Update existing record
        console.log("[Synthesis] Updating existing record");
        const { error } = await supabase
          .from('questionnaire_synthesis')
          .update({ free_text: text })
          .eq('user_id', userId);
          
        saveError = error;
      } else {
        // Insert new record
        console.log("[Synthesis] Creating new record");
        const { error } = await supabase
          .from('questionnaire_synthesis')
          .insert({
            user_id: userId,
            free_text: text
          });
          
        saveError = error;
      }

      if (saveError) {
        console.error("[Synthesis] Error saving synthesis:", saveError);
        throw saveError;
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
    } finally {
      setIsSaving(false);
    }
  };

  return {
    text,
    setText,
    saveSynthesis,
    isSaving,
    isLoading
  };
}

import { supabase } from "@/integrations/supabase/client";
import { NewTrustedPerson } from "@/types/trusted-person";
import { useToast } from "./use-toast";

export const useSynthesisUpdate = () => {
  const { toast } = useToast();

  const updateSynthesis = async (userId: string, person: NewTrustedPerson) => {
    try {
      console.log("[SynthesisUpdate] Updating synthesis with trusted person info");
      
      const { data: currentSynthesis, error: synthesisError } = await supabase
        .from("questionnaire_synthesis")
        .select("free_text")
        .eq("user_id", userId)
        .maybeSingle();

      if (synthesisError) {
        console.error("[SynthesisUpdate] Error fetching synthesis:", synthesisError);
        throw synthesisError;
      }

      const currentText = currentSynthesis?.free_text || "";
      
      const separator = "\n\n-------------------------------------------\n";
      const trustedPersonText = `${separator}PERSONNE DE CONFIANCE\n\nNom: ${person.name}\nTéléphone: ${person.phone}\nEmail: ${person.email}${person.relation ? `\nRelation: ${person.relation}` : ""}${person.address ? `\nAdresse: ${person.address}` : ""}${person.city || person.postal_code ? `\n${person.postal_code} ${person.city}` : ""}`;

      const operation = currentSynthesis ? 
        supabase
          .from("questionnaire_synthesis")
          .update({ free_text: currentText + trustedPersonText })
          .eq("user_id", userId) :
        supabase
          .from("questionnaire_synthesis")
          .insert({ user_id: userId, free_text: trustedPersonText });

      const { error: updateError } = await operation;

      if (updateError) {
        console.error("[SynthesisUpdate] Error updating synthesis:", updateError);
        throw updateError;
      }

      console.log("[SynthesisUpdate] Successfully updated synthesis with trusted person info");
    } catch (error) {
      console.error("[SynthesisUpdate] Error updating synthesis:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la synthèse.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { updateSynthesis };
};
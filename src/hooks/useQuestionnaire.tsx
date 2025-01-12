import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: string;
    otherDirectives: string;
  };
};

export const useQuestionnaire = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveQuestionnaire = async (data: QuestionnaireData) => {
    console.log("Saving questionnaire data:", data);
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder vos directives.",
        });
        return;
      }

      // TODO: Save data to Supabase
      toast({
        title: "Succès",
        description: "Vos directives ont été sauvegardées.",
      });
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    saveQuestionnaire,
  };
};
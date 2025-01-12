import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: Record<string, string>;
    otherDirectives: Record<string, boolean>;
    lifeSupport: Record<string, boolean>;
    painRelief: Record<string, boolean>;
    letDie: Record<string, boolean>;
  };
};

export const useQuestionnaire = () => {
  const form = useForm<QuestionnaireData>({
    defaultValues: {
      medicalDirectives: {
        generalOpinion: {},
        otherDirectives: {},
        lifeSupport: {},
        painRelief: {},
        letDie: {}
      }
    }
  });
  
  const { toast } = useToast();

  const onSubmit = async (data: QuestionnaireData) => {
    try {
      console.log('Submitting form data:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder vos directives.",
        });
        return;
      }

      // Initialize objects
      const formattedData = {
        user_id: session.user.id,
        general_opinion: Object.values(data.medicalDirectives.generalOpinion || {}).some(value => value === 'oui'),
        other_directives: Object.values(data.medicalDirectives.otherDirectives || {}).some(value => value),
        life_support: JSON.stringify(data.medicalDirectives.lifeSupport || {}),
        pain_relief: JSON.stringify(data.medicalDirectives.painRelief || {}),
        let_die: JSON.stringify(data.medicalDirectives.letDie || {}),
      };

      console.log('Formatted data for submission:', formattedData);

      const { error } = await supabase
        .from('advance_directives')
        .upsert(formattedData);

      if (error) {
        console.error("Error saving form:", error);
        throw error;
      }
      
      toast({
        title: "Succès",
        description: "Vos directives ont été sauvegardées.",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
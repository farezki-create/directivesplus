import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface UseQuestionnaireOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: Record<string, string>;
    otherDirectives: Record<string, boolean>;
    lifeSupport: Record<string, boolean>;
    painRelief: Record<string, boolean>;
    letDie: Record<string, boolean>;
  };
};

export const useQuestionnaire = (options?: UseQuestionnaireOptions) => {
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
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: QuestionnaireData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting form data:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Vous devez être connecté pour sauvegarder vos directives.");
      }

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
      
      options?.onSuccess?.();
    } catch (error) {
      console.error("Error saving form:", error);
      options?.onError?.(error instanceof Error ? error : new Error('Une erreur est survenue'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting
  };
};

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuestionOptions } from "./questions/QuestionOptions";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { getPreferencesOptions } = useQuestionOptions();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["preferences-questions", currentLanguage],
    queryFn: async () => {
      console.log(`[Preferences] Fetching questions in ${currentLanguage}...`);
      
      // Determine which table to query based on language
      const tableName = currentLanguage === 'en' 
        ? 'questionnaire_preferences_en' 
        : 'questionnaire_preferences_fr';
      
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("[Preferences] Error fetching questions:", error);
        throw error;
      }
      console.log('[Preferences] Questions loaded:', data?.length, 'questions');
      return data || [];
    },
  });

  const handleSubmit = async () => {
    try {
      console.log('[Preferences] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[Preferences] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions?.find(q => q.id === questionId);
        
        // Safely access question text regardless of the property name
        const questionText = question?.question || question?.question_text || '';
        
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: questionText,
          response: value,
          questionnaire_type: 'preferences'
        }));
      });

      console.log('[Preferences] Prepared responses for insertion:', responses);

      // Delete existing responses before inserting new ones
      await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('user_id', userId)
        .eq('questionnaire_type', 'preferences');

      // Insert new responses
      for (const response of responses) {
        const { error } = await supabase
          .from('questionnaire_responses')
          .insert(response);

        if (error) {
          console.error('[Preferences] Error saving response:', error);
          toast({
            title: "Erreur",
            description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('[Preferences] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
      setAnswers({});
    } catch (error) {
      console.error('[Preferences] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[Preferences] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('preferences')}
      onSubmit={handleSubmit}
      loading={isLoading}
      questionsLength={questions?.length || 0}
    >
      {questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getPreferencesOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}

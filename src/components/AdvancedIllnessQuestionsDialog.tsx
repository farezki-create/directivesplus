
import { useState, useEffect } from "react";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[AdvancedIllness] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const { data, error } = await supabase
            .from('advanced_illness_questions_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[AdvancedIllness] Error fetching questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
          setQuestions(data || []);
        } else {
          // Fetch French questions
          const { data, error } = await supabase
            .from('advanced_illness_questions')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[AdvancedIllness] Error fetching questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
          setQuestions(data || []);
        }
      } catch (error) {
        console.error('[AdvancedIllness] Unexpected error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[AdvancedIllness] Answer change:', { questionId, value, checked });
    
    if (checked) {
      setAnswers(prev => {
        // When adding an option
        const updatedValues = [...(prev[questionId] || [])];
        if (!updatedValues.includes(value)) {
          updatedValues.push(value);
        }
        return {
          ...prev,
          [questionId]: updatedValues
        };
      });
    } else {
      setAnswers(prev => {
        // When removing an option
        const newValues = prev[questionId]?.filter(v => v !== value) || [];
        return {
          ...prev,
          [questionId]: newValues
        };
      });
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('[AdvancedIllness] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[AdvancedIllness] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value
        }));
      });

      console.log('[AdvancedIllness] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,response'
        });

      if (error) {
        console.error('[AdvancedIllness] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[AdvancedIllness] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[AdvancedIllness] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const getQuestionOptions = (question: any) => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'yes_medical', label: 'Yes if the medical team deems it useful' },
        { value: 'yes_trusted', label: 'Yes if my trusted person deems it useful' }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'oui_medical', label: t('yesMedicalTeam') },
        { value: 'oui_confiance', label: t('yesTrustedPerson') }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('advancedIllnessTitle')}
      description={t('advancedIllnessDesc')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getQuestionOptions(question)}
          multiple={true}
        />
      ))}
    </QuestionsDialogLayout>
  );
}

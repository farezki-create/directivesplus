import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[LifeSupport] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          const { data, error } = await supabase
            .from('questionnaire_life_support_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[LifeSupport] Questions loaded:', data?.length, 'questions');
          console.log('[LifeSupport] Questions order:', data?.map(q => q.display_order));
          setQuestions(data || []);
        } else {
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*')
            .order('question_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          const formattedData = data?.map(item => ({
            id: item.id,
            question: item.question_text,
            display_order: item.question_order
          })) || [];
          
          console.log('[LifeSupport] Questions loaded:', formattedData.length, 'questions');
          console.log('[LifeSupport] Questions order:', formattedData.map(q => q.display_order));
          setQuestions(formattedData);
        }
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
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
    console.log('[LifeSupport] Answer change:', { questionId, value, checked });
    
    setAnswers(prev => {
      if (checked) {
        return {
          ...prev,
          [questionId]: [value]
        };
      } 
      else {
        const newValues = prev[questionId]?.filter(v => v !== value) || [];
        return {
          ...prev,
          [questionId]: newValues
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('[LifeSupport] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[LifeSupport] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id.toString() === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value,
          questionnaire_type: 'life_support'
        }));
      });

      console.log('[LifeSupport] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,questionnaire_type'
        });

      if (error) {
        console.error('[LifeSupport] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[LifeSupport] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[LifeSupport] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
        { value: 'I dont know', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' },
        { value: 'Je ne sais pas', label: 'Je ne sais pas' }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('lifeSupport')}
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
          options={getQuestionOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}

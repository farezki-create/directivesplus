
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[GeneralOpinion] Loading custom general opinion questions...`);
        
        // These are the custom questions based on user requirements
        const customQuestions = [
          {
            id: 'q1',
            question: "Je voudrais m'accrocher jusqu'au bout tant qu'il y'a de la vie il y'a de l'espoir",
            display_order: 1
          },
          {
            id: 'q2',
            question: "Pour l'instant je souhaite ne pas me déterminer sur les points évoqués je ne peux pas me projeter",
            display_order: 2
          },
          {
            id: 'q3',
            question: "Ma priorité est le soulagement efficace de mes souffrances même si cela devrait abréger ma vie",
            display_order: 3
          },
          {
            id: 'q4',
            question: "Je laisse l'équipe médicale décider des soins et traitements appropriés en évitant toute obstination déraisonnable et en se conformant à la loi en vigueur",
            display_order: 4
          },
          {
            id: 'q5',
            question: "Je voudrais qu'on me laisse mourir c'est mon souhait le plus cher mourir vite ne me laissez pas souffrir",
            display_order: 5
          },
          {
            id: 'q6',
            question: "Je voudrais mourir à la maison",
            display_order: 6
          },
          {
            id: 'q7',
            question: "Je souhaite pouvoir faire un don d'organes après ma mort si cela est possible",
            display_order: 7
          },
          {
            id: 'q8',
            question: "Il est important pour moi d'avoir mes proches et mes amis à mes côtés",
            display_order: 8
          },
          {
            id: 'q9',
            question: "La foi la religion ou la spiritualité sont importantes pour moi",
            display_order: 9
          }
        ];
        
        setQuestions(customQuestions);
        setLoading(false);
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('[GeneralOpinion] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[GeneralOpinion] No user ID found');
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

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_general_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[GeneralOpinion] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
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
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ];
    } else {
      return [
        { value: 'oui', label: 'OUI' },
        { value: 'non', label: 'NON' }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}

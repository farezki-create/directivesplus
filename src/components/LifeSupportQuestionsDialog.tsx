import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useQuestionnaireAnswers } from "./questionnaire/useQuestionnaireAnswers";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data: existingAnswers, isLoading: loadingAnswers } = useQuestionnaireAnswers("life_support");
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching life support questions...");
        const { data, error } = await supabase
          .from('life_support_questions')
          .select('*');
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from life_support_questions table:', data);
        setQuestions(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  // Pré-remplir les réponses existantes
  useEffect(() => {
    if (existingAnswers && existingAnswers.length > 0) {
      console.log('Chargement des réponses existantes:', existingAnswers);
      const answersMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        if (answer.question_id) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      setAnswers(answersMap);
    }
  }, [existingAnswers]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }

    try {
      console.log('Saving answers:', answers);
      
      // Save individual answers
      for (const [questionId, answer] of Object.entries(answers)) {
        const { error } = await supabase
          .from('questionnaire_answers')
          .upsert({
            user_id: session.user.id,
            questionnaire_type: 'life_support',
            question_id: questionId,
            answer: answer
          }, {
            onConflict: 'user_id, questionnaire_type, question_id'
          });

        if (error) {
          console.error('Error saving answer:', error);
          throw error;
        }
      }

      // Update synthesis
      const { error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (synthesisError) {
        console.error('Error updating synthesis:', synthesisError);
        throw synthesisError;
      }

      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving answers:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    }
  };

  const getQuestionOptions = (question: any) => [
    { value: 'indecision', label: question.Indécision },
    { value: 'oui', label: question.Oui },
    { 
      value: 'oui_duree_moderee', 
      label: question["Oui pour une durée modérée"]
    },
    { 
      value: 'oui_medical', 
      label: question["Oui seulement si l'équipe médicale le juge utile"]
    },
    { 
      value: 'non_abandonner', 
      label: question["Non rapidement abandonner le thérapeutique"]
    },
    { 
      value: 'non_souffrance', 
      label: question["La non souffrance est à privilégier"]
    }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maintien en vie"
      onSubmit={handleSubmit}
      loading={loading || loadingAnswers}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
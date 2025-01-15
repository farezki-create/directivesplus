import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useQuestionnaireAnswers } from "./questionnaire/useQuestionnaireAnswers";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data: existingAnswers, isLoading: loadingAnswers } = useQuestionnaireAnswers("preferences");
  const session = useSession();
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["preferences-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preferences_questions")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching preferences questions:", error);
        throw error;
      }
      return data;
    },
  });

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
            questionnaire_type: 'preferences',
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

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Mes goûts et mes peurs"
      onSubmit={handleSubmit}
      loading={isLoading || loadingAnswers}
      questionsLength={questions?.length || 0}
    >
      {questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={[
            { label: "Oui", value: "oui" },
            { label: "Non", value: "non" },
            { label: "Je ne sais pas", value: "indecis" }
          ]}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
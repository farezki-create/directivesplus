import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionnaireAnswers } from "./questionnaire/useQuestionnaireAnswers";

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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data: existingAnswers, isLoading: loadingAnswers } = useQuestionnaireAnswers("advanced_illness");
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching advanced illness questions...");
        const { data, error } = await supabase
          .from('advanced_illness_questions')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from advanced_illness_questions table:', data);
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
            questionnaire_type: 'advanced_illness',
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

      // Update or create synthesis entry
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
    { 
      value: 'oui_medical', 
      label: question["Oui si l'équipe médicale le juge utile"]
    },
    { 
      value: 'oui_confiance', 
      label: question["Oui si ma personne de confiance le juge utile"]
    },
    { value: 'oui', label: question.oui },
    { value: 'non', label: question.non }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maladie avancée"
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
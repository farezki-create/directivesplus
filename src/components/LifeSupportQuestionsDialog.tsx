import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";

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

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching life support questions...");
        const { data, error } = await supabase
          .from('life_support_questions')
          .select('*')
          .order('display_order', { ascending: true });
        
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

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value] // Wrap single value in array
    }));
  };

  const handleSubmit = () => {
    console.log('Réponses soumises:', answers);
    onOpenChange(false);
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
      loading={loading}
      questionsLength={questions.length}
    >
      <div className="mb-4 text-lg font-bold">
        Que pensez-vous de :
      </div>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
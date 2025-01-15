import { QuestionCard } from "./QuestionCard";

interface QuestionsFormProps {
  questions: any[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
}

export function QuestionsForm({
  questions,
  answers,
  onAnswerChange
}: QuestionsFormProps) {
  const getQuestionOptions = (question: any) => [
    { value: 'oui', label: question.OUI || "Oui" },
    { value: 'non', label: question.NON || "Non" }
  ];

  return (
    <>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || ''}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </>
  );
}
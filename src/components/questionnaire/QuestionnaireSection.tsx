import { QuestionnaireAnswer } from "@/types/questionnaire";

interface QuestionnaireSectionProps {
  title: string;
  answers?: QuestionnaireAnswer[];
}

export function QuestionnaireSection({ title, answers }: QuestionnaireSectionProps) {
  if (!answers?.length) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {answers.map((answer) => (
          <li key={answer.id} className="border-b pb-2">
            <p className="font-medium">{answer.question?.Question || answer.question?.question}</p>
            <p className="text-muted-foreground">{answer.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
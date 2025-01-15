import { QuestionnaireAnswer } from "@/types/questionnaire";

interface QuestionnaireSectionProps {
  title: string;
  answers?: QuestionnaireAnswer[];
}

export function QuestionnaireSection({ title, answers }: QuestionnaireSectionProps) {
  if (!answers?.length) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground italic">Aucune réponse enregistrée</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-3">
        {answers.map((answer) => (
          <li key={answer.id} className="bg-muted/50 p-4 rounded-lg">
            <p className="font-medium text-foreground mb-2">
              {answer.question?.question}
            </p>
            <p className="text-muted-foreground">
              Réponse : {answer.answer}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
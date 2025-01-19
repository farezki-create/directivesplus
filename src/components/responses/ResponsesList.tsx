interface FormattedResponse {
  question: string;
  responses: string[];
}

interface ResponsesListProps {
  formattedResponses: FormattedResponse[];
}

export function ResponsesList({ formattedResponses }: ResponsesListProps) {
  if (formattedResponses.length === 0) {
    return <p className="text-muted-foreground">Aucune réponse</p>;
  }

  return (
    <ul className="space-y-6">
      {formattedResponses.map((item: FormattedResponse, index: number) => (
        <li key={index} className="border-b pb-4">
          <p className="font-medium text-base mb-2">{item.question}</p>
          <div className="pl-4">
            {item.responses.map((response: string, idx: number) => (
              <p key={idx} className="text-lg font-semibold text-primary">
                {response}
              </p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
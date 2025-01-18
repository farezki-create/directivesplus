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
    <ul className="space-y-4">
      {formattedResponses.map((item: FormattedResponse, index: number) => (
        <li key={index} className="border-b pb-2">
          <p className="font-medium">{item.question}</p>
          <div className="text-muted-foreground">
            {item.responses.map((response: string, idx: number) => (
              <p key={idx}>{response}</p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="space-y-1">
      <p className="font-medium text-primary">{question}</p>
      <p className="text-foreground">{response}</p>
    </div>
  );
};
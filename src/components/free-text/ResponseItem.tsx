interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-1">{question}</p>
      <p className="text-xl font-semibold text-primary">{response}</p>
    </div>
  );
};
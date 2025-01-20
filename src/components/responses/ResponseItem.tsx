interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="mb-8 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <p className="text-sm font-medium text-muted-foreground mb-2">{question}</p>
      <p className="text-2xl font-semibold text-primary leading-relaxed">{response}</p>
    </div>
  );
};
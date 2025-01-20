interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="mb-8 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <p className="text-lg font-medium text-primary-foreground mb-3 bg-primary px-4 py-2 rounded-md inline-block">{question}</p>
      <p className="text-2xl font-semibold text-primary leading-relaxed">{response}</p>
    </div>
  );
};
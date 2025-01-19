interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="mb-4">
      <p className="text-sm">{question}</p>
      <p className="text-lg font-semibold text-primary">{response}</p>
    </div>
  );
};
interface ResponseItemProps {
  question: string;
  response: string;
}

export const ResponseItem = ({ question, response }: ResponseItemProps) => {
  return (
    <div className="space-y-1">
      <p className="font-medium">{question}</p>
      <p className="text-gray-600">{response}</p>
    </div>
  );
};
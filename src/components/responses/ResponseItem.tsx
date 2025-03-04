
interface ResponseItemProps {
  question: string;
  response: string;
  isImported?: boolean;
}

export const ResponseItem = ({ question, response, isImported = false }: ResponseItemProps) => {
  return (
    <div className="space-y-1">
      <p className={`font-medium ${isImported ? "text-amber-600" : "text-primary"}`}>{question}</p>
      <p className={`${isImported ? "italic text-gray-600" : "text-foreground"}`}>{response}</p>
    </div>
  );
};

import { ResponseItem } from "./ResponseItem";

interface ResponseSectionProps {
  title: string;
  items: Array<{
    question: string;
    response: string;
  }>;
}

export const ResponseSection = ({ title, items }: ResponseSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.map((item, index) => (
        <ResponseItem key={index} question={item.question} response={item.response} />
      ))}
    </div>
  );
};
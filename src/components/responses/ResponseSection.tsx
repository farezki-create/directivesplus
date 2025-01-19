import { ResponseItem } from "./ResponseItem";
import { formatResponseText } from "../free-text/ResponseFormatter";

interface ResponseSectionProps {
  title: string;
  responses: any[];
}

export const ResponseSection = ({ title, responses }: ResponseSectionProps) => {
  if (!responses || responses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {responses.map((response, index) => (
          <ResponseItem
            key={index}
            question={response.question_text || response.questions?.Question}
            response={formatResponseText(response.response)}
          />
        ))}
      </div>
    </div>
  );
};
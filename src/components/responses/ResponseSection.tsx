
import { ResponseItem } from "./ResponseItem";
import { formatResponseText } from "../free-text/ResponseFormatter";

interface ResponseSectionProps {
  title: string;
  responses: any[];
  isImported?: boolean;
}

export const ResponseSection = ({ title, responses, isImported = false }: ResponseSectionProps) => {
  if (!responses || responses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isImported ? "text-amber-600" : ""}`}>
        {isImported ? `${title} (Importé)` : title}
      </h3>
      <div className="space-y-2">
        {responses.map((response, index) => (
          <ResponseItem
            key={index}
            question={response.question_text || response.questions?.Question}
            response={formatResponseText(response.response)}
            isImported={isImported}
          />
        ))}
      </div>
    </div>
  );
};

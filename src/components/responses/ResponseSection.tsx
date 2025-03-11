
import { ResponseItem } from "./ResponseItem";
import { formatResponseText } from "../free-text/ResponseFormatter";

interface ResponseSectionProps {
  title: string;
  responses: any[];
}

export const ResponseSection = ({ title, responses }: ResponseSectionProps) => {
  if (!responses || responses.length === 0) {
    console.log(`No responses found for section: ${title}`);
    return null;
  }

  console.log(`Rendering ${responses.length} responses for section: ${title}`);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {responses.map((response, index) => {
          const question = response.question_text || response.questions?.Question || 'Question non disponible';
          const responseText = formatResponseText(response.response);
          
          console.log(`Response ${index + 1}:`, { question, responseText });
          
          return (
            <ResponseItem
              key={index}
              question={question}
              response={responseText}
            />
          );
        })}
      </div>
    </div>
  );
};

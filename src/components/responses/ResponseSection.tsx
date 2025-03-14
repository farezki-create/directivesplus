
import { ResponseItem } from "./ResponseItem";
import { formatResponseText } from "../free-text/ResponseFormatter";

interface ResponseSectionProps {
  title: string;
  responses: any[];
}

export const ResponseSection = ({ title, responses }: ResponseSectionProps) => {
  if (!responses || responses.length === 0) {
    console.log(`Aucune réponse trouvée pour la section: ${title}`);
    return null;
  }

  console.log(`Rendu de ${responses.length} réponses pour la section: ${title}`);
  console.log("Réponses brutes:", JSON.stringify(responses));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {responses.map((response, index) => {
          // Gestion flexible des différentes structures de données possibles
          const question = response.question_text || response.question || response.questions?.Question || 'Question non disponible';
          const responseText = formatResponseText(response.response);
          
          console.log(`Réponse ${index + 1}:`, { question, responseText });
          
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
}

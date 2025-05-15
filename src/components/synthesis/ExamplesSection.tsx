
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ExamplesSectionProps {
  examplePhrases: string[];
  customPhrases: string[];
}

const ExamplesSection = ({ examplePhrases, customPhrases }: ExamplesSectionProps) => {
  const hasExamples = examplePhrases.length > 0 || customPhrases.length > 0;
  
  if (!hasExamples) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Directives spécifiques</CardTitle>
      </CardHeader>
      <CardContent>
        {examplePhrases.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Phrases prédéfinies</h3>
            <ul className="list-disc pl-5 space-y-2">
              {examplePhrases.map((phrase, index) => (
                <li key={index}>{phrase}</li>
              ))}
            </ul>
          </div>
        )}
        
        {customPhrases.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Phrases personnalisées</h3>
            <ul className="list-disc pl-5 space-y-2">
              {customPhrases.map((phrase, index) => (
                <li key={index}>{phrase}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamplesSection;

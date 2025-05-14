
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "./types";

interface QuestionItemProps {
  question: Question;
  response: string;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionItem = ({ question, response, onResponseChange }: QuestionItemProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{question.question}</h3>
        {question.explanation && (
          <p className="text-gray-600 mb-4 text-sm">{question.explanation}</p>
        )}
        
        {question.options ? (
          // Display radio buttons for questions with predefined options
          <RadioGroup 
            value={response || ''} 
            onValueChange={(value) => onResponseChange(question.id, value)}
            className="space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>{question.options.yes}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>{question.options.no}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id={`${question.id}-unsure`} />
              <Label htmlFor={`${question.id}-unsure`}>{question.options.unsure}</Label>
            </div>
          </RadioGroup>
        ) : (
          // Display textarea for free text answers
          <Textarea 
            placeholder="Votre réponse..."
            value={response || ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            className="mt-2"
            rows={4}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionItem;

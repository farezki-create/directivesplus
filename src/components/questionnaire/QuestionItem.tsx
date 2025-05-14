
import { Question } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionItemProps {
  question: Question;
  response: string;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionItem = ({ question, response, onResponseChange }: QuestionItemProps) => {
  // Get the default options if no specific options are provided
  const options = question.options || {
    yes: "Oui",
    no: "Non",
    unsure: "Je ne sais pas"
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <h3 className="font-medium text-lg">{question.question}</h3>
          {question.explanation && (
            <p className="text-gray-600 text-sm mt-2">{question.explanation}</p>
          )}
          <RadioGroup
            value={response}
            onValueChange={(value) => onResponseChange(question.id, value)}
            className="flex flex-col space-y-2 mt-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>{options.yes}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>{options.no}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unsure" id={`${question.id}-unsure`} />
              <Label htmlFor={`${question.id}-unsure`}>{options.unsure}</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionItem;

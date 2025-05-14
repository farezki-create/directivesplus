
import { Question } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionItemProps {
  question: Question;
  response: string;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionItem = ({ question, response, onResponseChange }: QuestionItemProps) => {
  // Render a different input based on the question type
  const renderInput = () => {
    // Life support questions have specific options (yes, no, unsure)
    if (question.options) {
      return (
        <RadioGroup
          value={response}
          onValueChange={(value) => onResponseChange(question.id, value)}
          className="flex flex-col space-y-2 mt-4"
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
      );
    }

    // For standard questions, use a textarea
    return (
      <Textarea
        value={response}
        onChange={(e) => onResponseChange(question.id, e.target.value)}
        placeholder="Votre réponse ici..."
        className="mt-4"
        rows={4}
      />
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div>
          <h3 className="font-medium text-lg">{question.question}</h3>
          {question.explanation && (
            <p className="text-gray-600 text-sm mt-2">{question.explanation}</p>
          )}
          {renderInput()}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionItem;


import { memo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "./types";

interface QuestionItemProps {
  question: Question;
  response: string;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionItem = memo(({ question, response, onResponseChange }: QuestionItemProps) => {
  // Use question options if available, otherwise use default options
  const options = question.options || {
    yes: 'Oui',
    no: 'Non',
    unsure: 'Je ne sais pas'
  };
  
  // Handler for both direct radio change and label clicks
  const handleChange = useCallback((value: string) => {
    console.log(`QuestionItem: Setting response for question ${question.id} to "${value}"`);
    onResponseChange(question.id, value);
  }, [question.id, onResponseChange]);
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{question.question}</h3>
        {question.explanation && (
          <p className="text-gray-600 mb-4 text-sm">{question.explanation}</p>
        )}
        
        <RadioGroup 
          value={response} 
          onValueChange={handleChange}
          className="space-y-3 mt-4"
        >
          {/* Yes option */}
          <div className="flex items-center space-x-2" onClick={() => handleChange("yes")}>
            <RadioGroupItem 
              value="yes" 
              id={`${question.id}-yes`}
              checked={response === "yes"}
              aria-labelledby={`${question.id}-yes-label`}
            />
            <Label 
              htmlFor={`${question.id}-yes`}
              id={`${question.id}-yes-label`}
              className="cursor-pointer w-full py-1"
            >
              {options.yes}
            </Label>
          </div>
          
          {/* No option */}
          <div className="flex items-center space-x-2" onClick={() => handleChange("no")}>
            <RadioGroupItem 
              value="no" 
              id={`${question.id}-no`}
              checked={response === "no"}
              aria-labelledby={`${question.id}-no-label`}
            />
            <Label 
              htmlFor={`${question.id}-no`}
              id={`${question.id}-no-label`}
              className="cursor-pointer w-full py-1"
            >
              {options.no}
            </Label>
          </div>
          
          {/* Unsure option */}
          <div className="flex items-center space-x-2" onClick={() => handleChange("unsure")}>
            <RadioGroupItem 
              value="unsure" 
              id={`${question.id}-unsure`}
              checked={response === "unsure"}
              aria-labelledby={`${question.id}-unsure-label`}
            />
            <Label 
              htmlFor={`${question.id}-unsure`}
              id={`${question.id}-unsure-label`}
              className="cursor-pointer w-full py-1"
            >
              {options.unsure}
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
});

QuestionItem.displayName = "QuestionItem";

export default QuestionItem;

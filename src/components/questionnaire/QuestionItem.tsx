
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
  
  // Make sure the handler is stable with useCallback
  const handleChange = useCallback((value: string) => {
    console.log(`QuestionItem: Selecting response for question ${question.id}: "${value}"`);
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
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="yes" 
              id={`${question.id}-yes`}
            />
            <Label 
              htmlFor={`${question.id}-yes`}
              className="cursor-pointer w-full py-1"
            >
              {options.yes}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="no" 
              id={`${question.id}-no`}
            />
            <Label 
              htmlFor={`${question.id}-no`}
              className="cursor-pointer w-full py-1"
            >
              {options.no}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="unsure" 
              id={`${question.id}-unsure`}
            />
            <Label 
              htmlFor={`${question.id}-unsure`}
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

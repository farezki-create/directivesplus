
import { memo } from "react";
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
  
  const handleRadioChange = (value: string) => {
    console.log(`Changing response for question ${question.id} to ${value}`);
    onResponseChange(question.id, value);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{question.question}</h3>
        {question.explanation && (
          <p className="text-gray-600 mb-4 text-sm">{question.explanation}</p>
        )}
        
        <RadioGroup 
          value={response} 
          onValueChange={handleRadioChange}
          className="space-y-2 mt-4"
        >
          {/* Option Oui */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${question.id}-yes`} />
            <Label 
              htmlFor={`${question.id}-yes`}
              className="text-sm font-medium cursor-pointer w-full"
              onClick={() => handleRadioChange("yes")}
            >
              {options.yes}
            </Label>
          </div>
          
          {/* Option Non */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${question.id}-no`} />
            <Label 
              htmlFor={`${question.id}-no`}
              className="text-sm font-medium cursor-pointer w-full"
              onClick={() => handleRadioChange("no")}
            >
              {options.no}
            </Label>
          </div>
          
          {/* Option Je ne sais pas */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id={`${question.id}-unsure`} />
            <Label 
              htmlFor={`${question.id}-unsure`}
              className="text-sm font-medium cursor-pointer w-full"
              onClick={() => handleRadioChange("unsure")}
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

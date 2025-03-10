
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { getQuestionExplanation } from "@/utils/explanations";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface QuestionWithExplanationProps {
  question: any;
  value: string[];
  onValueChange: (value: string, checked?: boolean) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  language: 'en' | 'fr';
}

export function QuestionWithExplanation({
  question,
  value,
  onValueChange,
  options,
  language
}: QuestionWithExplanationProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Get the display order to use as the explanation ID
  const displayOrder = question.display_order?.toString() || '';
  
  // Only render the explanation if we have a valid displayOrder
  const explanation = displayOrder ? getQuestionExplanation(displayOrder, language) : '';
  
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      {explanation && (
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleExplanation}
            className="text-muted-foreground mb-2 flex items-center gap-1"
          >
            <InfoIcon size={16} />
            {language === 'en' ? 'Explanation' : 'Explication'}
          </Button>
          
          {showExplanation && (
            <div className="text-base text-muted-foreground bg-muted p-4 rounded-md">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

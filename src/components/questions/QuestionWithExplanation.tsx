
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { getQuestionExplanation } from "@/utils/explanations";
import { MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionWithExplanationProps {
  question: any;
  value: string[];
  onValueChange: (value: string) => void;
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
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {explanation && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <MessageCircleQuestion className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Explanation' : 'Explication'}
          </Button>
        )}
      </div>
      
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      
      {explanation && showExplanation && (
        <div className="mt-3 text-base text-muted-foreground bg-muted p-4 rounded-md">
          {explanation}
        </div>
      )}
    </div>
  );
}

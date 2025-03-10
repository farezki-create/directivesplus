
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
  const [showExplanation, setShowExplanation] = useState(true);
  
  // Extract numeric display order for advanced illness questions
  // This will be used as the key to match with the explanations
  let explanationId = '';
  
  if (question.display_order) {
    // If display_order exists, use it as a string
    explanationId = question.display_order.toString();
  } else if (question.display_order_str) {
    // Use the display_order_str if available
    explanationId = question.display_order_str;
  } else if (question.id) {
    // Fallback to id
    explanationId = question.id.toString();
  }
  
  // Get the explanation using the extracted ID
  const explanation = getQuestionExplanation(explanationId, language);
  
  // For debugging
  console.log("Question:", question);
  console.log("Using explanation ID:", explanationId);
  console.log("Found explanation:", explanation);
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      
      {explanation && (
        <div className="flex items-center mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <MessageCircleQuestion className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Explanation' : 'Explication'}
          </Button>
        </div>
      )}
      
      {explanation && showExplanation && (
        <div className="mt-1 text-sm text-muted-foreground bg-muted p-4 rounded-md">
          {explanation}
        </div>
      )}
    </div>
  );
}


import React from "react";
import { QuestionCard } from "./QuestionCard";
import { getQuestionExplanation } from "@/utils/explanations";

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
        <div className="mt-4 text-base text-foreground bg-muted/60 p-5 rounded-md border border-muted shadow-sm">
          {explanation}
        </div>
      )}
    </div>
  );
}

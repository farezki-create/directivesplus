
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
  // Get the display order to use as the explanation ID
  const displayOrder = question.display_order?.toString() || '';
  
  // Only render the explanation if we have a valid displayOrder
  const explanation = displayOrder ? getQuestionExplanation(displayOrder, language) : '';
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      {explanation && (
        <div className="mt-3 text-base text-muted-foreground bg-muted p-4 rounded-md">
          {explanation}
        </div>
      )}
    </div>
  );
}

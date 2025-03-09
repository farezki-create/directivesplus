
import React from "react";
import { QuestionCard } from "./QuestionCard";
import { getQuestionExplanation } from "@/utils/questionExplanations";

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
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={question}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      {displayOrder && (
        <div className="mt-3 text-base text-muted-foreground bg-muted p-4 rounded-md">
          {getQuestionExplanation(displayOrder, language)}
        </div>
      )}
    </div>
  );
}

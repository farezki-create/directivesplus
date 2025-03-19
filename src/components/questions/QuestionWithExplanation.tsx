
import React from "react";
import { QuestionCard } from "./QuestionCard";

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
  // Validate question object
  if (!question) {
    console.error("Question object is null or undefined");
    return null;
  }
  
  // Get the question text, with fallbacks to ensure it exists
  const questionText = question.question || question.question_text || '';
  
  if (!questionText) {
    console.error("Question text is missing", question);
    return null;
  }
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={{
          ...question,
          question: questionText
        }}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
    </div>
  );
}

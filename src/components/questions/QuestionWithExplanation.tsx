
import React from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionExplanationAccordion } from "./QuestionExplanationAccordion";

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

  // Use explanation directly from the question object from database
  const explanation = question.explanation || '';

  // Debug log
  console.log("Question with explanation:", { 
    id: question.id, 
    text: questionText.substring(0, 30) + "...", 
    hasExplanation: !!explanation,
    explanationLength: explanation?.length || 0,
    explanation: explanation ? explanation.substring(0, 30) + "..." : "None"
  });
  
  return (
    <div className="mb-8">
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <QuestionCard
          question={{
            ...question,
            question: questionText
          }}
          value={value}
          onValueChange={onValueChange}
          options={options}
        />
        
        {/* Use the QuestionExplanationAccordion component */}
        <QuestionExplanationAccordion
          explanationText={explanation}
          language={language}
        />
      </div>
    </div>
  );
}

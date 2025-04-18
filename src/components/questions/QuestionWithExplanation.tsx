
import React from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionExplanationAccordion } from "./QuestionExplanationAccordion";
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

  // First try to get explanation directly from the database record
  let explanation = question.explanation || '';
  
  // If no explanation found directly, try using the utility function as a fallback
  if (!explanation || explanation.trim() === '') {
    explanation = getQuestionExplanation(question.id, language, questionText);
  }
  
  // Debug logging
  console.log(`[QuestionWithExplanation] Question: "${questionText.substring(0, 30)}..."`, 
    `Direct explanation: ${!!question.explanation}, Length: ${question.explanation?.length || 0}`,
    `Final explanation: ${!!explanation}, Length: ${explanation?.length || 0}`);

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
        
        {/* Only render explanation if it exists */}
        {explanation && explanation.trim() !== '' && (
          <QuestionExplanationAccordion
            explanationText={explanation}
            language={language}
          />
        )}
      </div>
    </div>
  );
}

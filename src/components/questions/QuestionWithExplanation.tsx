
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
  
  // Skip explanations for life support questions entirely
  // Check if this is a life support question by examining if it's from the life support questionnaire
  const isLifeSupportQuestion = 
    (question.id >= 21 && question.id <= 32) || // English life support questions use IDs 21-32
    (question.question_order >= 21 && question.question_order <= 32); // French life support questions use question_order 21-32
  
  let explanation = '';
  
  // Only get explanation if this is NOT a life support question
  if (!isLifeSupportQuestion) {
    // Extract display order - prioritize display_order or question_order for explanation lookup
    let explanationId = '';
    
    // First try using display_order (numerical field)
    if (question.display_order !== undefined && question.display_order !== null) {
      explanationId = question.display_order.toString();
    } 
    // Then try display_order_str (string representation)
    else if (question.display_order_str) {
      explanationId = question.display_order_str;
    }
    // Fall back to question_order
    else if (question.question_order) {
      explanationId = question.question_order.toString();
    }
    // Last resort fallback to numeric ID
    else if (question.id && !isNaN(parseInt(question.id))) {
      explanationId = question.id.toString();
    }
    
    // Get the explanation using the extracted ID AND question text for better matching
    explanation = getQuestionExplanation(explanationId, language, questionText);
  }
  
  // Skip rendering the explanation if it's empty
  const hasExplanation = explanation && explanation.trim() !== '';
  
  return (
    <div className="mb-8">
      <QuestionCard
        question={{
          ...question,
          question: questionText // Ensure the question text is properly passed
        }}
        value={value}
        onValueChange={onValueChange}
        options={options}
      />
      
      {hasExplanation && (
        <div className="mt-4 text-base text-foreground bg-muted/60 p-5 rounded-md border border-muted shadow-sm">
          {explanation}
        </div>
      )}
    </div>
  );
}

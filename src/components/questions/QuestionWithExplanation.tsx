
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
  
  console.log("Processing question:", question);
  
  // Extract numeric display order for life support questions
  let explanationId = '';
  
  // Prioritize question_order for French or display_order for English
  if (question.question_order) {
    explanationId = question.question_order.toString();
    console.log(`Using question_order as explanationId: ${explanationId}`);
  } 
  else if (question.display_order) {
    explanationId = question.display_order.toString();
    console.log(`Using display_order as explanationId: ${explanationId}`);
  } 
  // Fallback to ID
  else if (question.id) {
    // If it's a numeric ID (likely from French tables)
    if (!isNaN(parseInt(question.id))) {
      explanationId = question.id.toString();
    } 
    // If it's a UUID
    else {
      explanationId = question.id.toString();
    }
    console.log(`Using id as explanationId: ${explanationId}`);
  }
  
  // Get the explanation using the extracted ID
  const explanation = getQuestionExplanation(explanationId, language);
  
  // For debugging
  console.log(`Question ID: ${question.id}, Explanation ID: ${explanationId}`);
  console.log("Found explanation:", explanation ? "Yes" : "No");
  
  // Get the question text, with fallbacks to ensure it exists
  const questionText = question.question || question.question_text || '';
  console.log(`Question text: "${questionText}"`);
  
  if (!questionText) {
    console.error("Question text is missing", question);
    return null;
  }
  
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
      
      {explanation && (
        <div className="mt-4 text-base text-foreground bg-muted/60 p-5 rounded-md border border-muted shadow-sm">
          {explanation}
        </div>
      )}
    </div>
  );
}

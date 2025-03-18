
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
  
  // FIRST CHECK: Explicit flag for life support questions
  if (question.isLifeSupportQuestion === true) {
    console.log(`Explicit life support flag detected - no explanation will be shown: "${questionText.substring(0, 50)}..."`);
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
  
  // SECOND CHECK: Determine if this is a life support question by ID range
  const questionId = 
    (question.id && !isNaN(parseInt(question.id)) ? parseInt(question.id) : null) || 
    (question.question_order ? parseInt(question.question_order) : null) ||
    (question.display_order ? parseInt(question.display_order) : null);
  
  if (questionId && questionId >= 21 && questionId <= 32) {
    console.log(`Life support question detected by ID range (${questionId}) - no explanation will be shown: "${questionText.substring(0, 50)}..."`);
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
  
  // THIRD CHECK: Content-based check for life support keywords
  const lifeSupportKeywords = language === 'en' 
    ? ['cpr', 'intensive care', 'intubated', 'ventilation', 'dialysis', 'tracheostomy', 'coma', 'artificial feeding']
    : ['rcp', 'réanimation', 'intubé', 'ventilation', 'dialyse', 'trachéotomie', 'coma', 'alimentation artificielle'];
  
  const containsLifeSupportKeyword = lifeSupportKeywords.some(keyword => 
    questionText.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (containsLifeSupportKeyword) {
    console.log(`Life support keyword detected - no explanation will be shown: "${questionText.substring(0, 50)}..."`);
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
  
  // For non-life support questions, get explanation ID
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
  const explanation = getQuestionExplanation(explanationId, language, questionText);
  
  // Log the explanation lookup result
  console.log(`Explanation for question "${questionText.substring(0, 30)}...": ${explanation ? "found" : "not found"}`);
  
  // Skip rendering the explanation if it's empty
  const hasExplanation = explanation && explanation.trim() !== '';
  
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
      
      {hasExplanation && (
        <div className="mt-4 text-base text-foreground bg-muted/60 p-5 rounded-md border border-muted shadow-sm">
          {explanation}
        </div>
      )}
    </div>
  );
}

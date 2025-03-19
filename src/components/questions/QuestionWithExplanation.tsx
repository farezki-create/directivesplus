
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
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
  const [showExplanation, setShowExplanation] = useState(false);
  
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

  // Get explanation from question or from the explanations utility
  let explanation = '';
  
  // First, try to get explanation directly from the question object
  if (question.explanation && question.explanation.trim() !== '') {
    explanation = question.explanation;
    console.log(`Using database explanation for question ID ${question.id}: "${question.explanation.substring(0, 30)}..."`);
  } 
  // If no explanation in the question object, try to get it from the utility
  else {
    // Check if it's a life support question by ID range (21-32) or explicit flag
    const isLifeSupportQuestion = 
      (question.id && !isNaN(parseInt(question.id)) && parseInt(question.id) >= 21 && parseInt(question.id) <= 32) ||
      question.isLifeSupportQuestion ||
      question.questionType === 'life_support';
    
    if (isLifeSupportQuestion) {
      console.log(`Life support question detected (ID: ${question.id}): ${questionText.substring(0, 30)}...`);
      // Life support questions don't have explanations
      explanation = '';
    } else {
      // For other question types, try to get explanation from the utility
      explanation = getQuestionExplanation(question.id, language, questionText);
      console.log(`Using utility explanation for question ID ${question.id}:`, explanation ? `Found: "${explanation.substring(0, 30)}..."` : 'Not found');
    }
  }

  // Debug log to check if explanation is being properly resolved
  console.log("Question with explanation resolved:", { 
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
        
        {explanation ? (
          <div className="mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-muted-foreground hover:text-primary"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Info className="mr-1 h-4 w-4" />
              {language === 'en' ? 'Explanation' : 'Explication'}
              {showExplanation ? (language === 'en' ? ' (hide)' : ' (masquer)') : (language === 'en' ? ' (show)' : ' (afficher)')}
            </Button>
            
            {showExplanation && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                {explanation}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 text-xs text-muted-foreground">
            {language === 'en' ? 'No explanation available' : 'Pas d\'explication disponible'}
          </div>
        )}
      </div>
    </div>
  );
}

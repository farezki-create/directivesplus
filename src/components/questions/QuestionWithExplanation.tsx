
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

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

  // Get explanation directly from the question object
  const explanation = question.explanation || '';
  
  console.log("Question with explanation:", { 
    id: question.id, 
    text: questionText.substring(0, 30) + "...", 
    hasExplanation: !!explanation,
    explanationLength: explanation?.length || 0
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
        
        {explanation && (
          <div className="mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-muted-foreground hover:text-primary"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Info className="mr-1 h-4 w-4" />
              {language === 'en' ? 'Explanation' : 'Explication'}
              {showExplanation ? ' (hide)' : ' (show)'}
            </Button>
            
            {showExplanation && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                {explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

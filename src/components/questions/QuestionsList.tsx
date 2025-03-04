
import React from "react";
import { QuestionCard } from "./QuestionCard";
import { Question, QuestionOption } from "@/hooks/useQuestionsData";

interface QuestionsListProps {
  questions: Question[];
  answers: Record<string, string[]>;
  onAnswerChange: (questionId: string, value: string) => void;
  options: QuestionOption[];
}

export function QuestionsList({ 
  questions, 
  answers, 
  onAnswerChange, 
  options 
}: QuestionsListProps) {
  return (
    <div className="space-y-6 py-4">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          options={options}
        />
      ))}
    </div>
  );
}

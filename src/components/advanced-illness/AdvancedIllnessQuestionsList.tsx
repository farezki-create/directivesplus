
import React from "react";
import { QuestionCard } from "../questions/QuestionCard";
import { useAdvancedIllnessQuestionOptions } from "./AdvancedIllnessQuestionOptions";

interface AdvancedIllnessQuestionsListProps {
  questions: any[];
  answers: Record<string, string[]>;
  onValueChange: (questionId: string, value: string, checked: boolean) => void;
}

export function AdvancedIllnessQuestionsList({
  questions,
  answers,
  onValueChange
}: AdvancedIllnessQuestionsListProps) {
  const { getQuestionOptions } = useAdvancedIllnessQuestionOptions();
  
  return (
    <>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => onValueChange(question.id, value, checked)}
          options={getQuestionOptions()}
          multiple={true}
        />
      ))}
    </>
  );
}

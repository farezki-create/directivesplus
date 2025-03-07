
import React from "react";
import { QuestionCard } from "../questions/QuestionCard";
import { useQuestionOptions } from "./useQuestionOptions";
import { QuestionnaireQuestion } from "@/hooks/questionnaire/useQuestionnaireQuestions";

interface LifeSupportQuestionsListProps {
  questions: QuestionnaireQuestion[];
  answers: Record<string, string[]>;
  onValueChange: (questionId: string, value: string, checked: boolean) => void;
}

export function LifeSupportQuestionsList({
  questions,
  answers,
  onValueChange
}: LifeSupportQuestionsListProps) {
  const { getQuestionOptions } = useQuestionOptions();
  const options = getQuestionOptions();

  return (
    <>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => onValueChange(question.id, value, checked)}
          options={options}
        />
      ))}
    </>
  );
}

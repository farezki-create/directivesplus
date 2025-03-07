import { useState } from "react";
import { useFetchAdvancedIllnessAnswers } from "./advanced-illness/useFetchAdvancedIllnessAnswers";
import { useSubmitAdvancedIllnessAnswers } from "./advanced-illness/useSubmitAdvancedIllnessAnswers";

export function useAdvancedIllnessResponses(open: boolean) {
  const [loading, setLoading] = useState(false);
  const { answers, setAnswers } = useFetchAdvancedIllnessAnswers(open);
  const { submitAnswers } = useSubmitAdvancedIllnessAnswers();

  const handleSubmit = async (questions: any[], onClose: (open: boolean) => void) => {
    setLoading(true);
    try {
      const success = await submitAnswers(answers, questions);
      if (success) {
        onClose(false);
        return true;
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value],
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((v: string) => v !== value),
        };
      }
    });
  };

  return {
    answers,
    loading,
    handleSubmit,
    handleAnswerChange,
  };
}
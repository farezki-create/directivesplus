import { useState } from "react";
import { useFetchAdvancedIllnessAnswers } from "./advanced-illness/useFetchAdvancedIllnessAnswers";
import { useSubmitAdvancedIllnessAnswers } from "./advanced-illness/useSubmitAdvancedIllnessAnswers";

export function useAdvancedIllnessResponses(open: boolean, questions: any[]) {
  const [loading, setLoading] = useState(false);
  const { answers, setAnswers } = useFetchAdvancedIllnessAnswers(open);
  const { submitAnswers } = useSubmitAdvancedIllnessAnswers();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const success = await submitAnswers(answers, questions);
      if (success) {
        return true;
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleAnswerChange = (questionId: string, response: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  return {
    answers,
    loading,
    handleSubmit,
    handleAnswerChange,
  };
}
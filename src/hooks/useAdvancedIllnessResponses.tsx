import { useAnswersState } from "./advanced-illness/useAnswersState";
import { useSubmitAnswers } from "./advanced-illness/useSubmitAnswers";

export function useAdvancedIllnessResponses(open: boolean) {
  const { answers, handleAnswerChange } = useAnswersState(open);
  const { handleSubmit, isSubmitting } = useSubmitAnswers();

  return {
    answers,
    handleAnswerChange,
    handleSubmit,
    isSubmitting
  };
}
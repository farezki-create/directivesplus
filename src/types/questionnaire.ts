export interface QuestionnaireAnswer {
  id: string;
  question_id: string;
  question: {
    Question?: string;
    question?: string;
  };
  answer: string;
}
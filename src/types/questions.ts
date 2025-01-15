export interface BaseQuestion {
  id: string;
  Question?: string;
  question?: string;
}

export interface JunctionData {
  answer_id: string;
  question_id: string;
}

export interface QuestionnaireMapping {
  questionsTable: string;
  junctionTable: string;
  questionField: "Question" | "question";
}

export interface QuestionnaireAnswer {
  id: string;
  question: {
    Question?: string;
    question?: string;
  };
  answer: string;
}
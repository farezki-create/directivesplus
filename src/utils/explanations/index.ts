
import { generalExplanationsEN, generalExplanationsFR } from './generalExplanations';
import { lifeSupportExplanationsEN, lifeSupportExplanationsFR } from './lifeSupportExplanations';
import { advancedIllnessExplanationsEN, advancedIllnessExplanationsFR } from './advancedIllnessExplanations';

// Define the explanation type
interface QuestionExplanation {
  id: string;
  explanation: string;
  question?: string; // Make question property optional
}

// Combine all explanations
const questionExplanationsEN: QuestionExplanation[] = [
  ...generalExplanationsEN,
  ...lifeSupportExplanationsEN,
  ...advancedIllnessExplanationsEN
];

const questionExplanationsFR: QuestionExplanation[] = [
  ...generalExplanationsFR,
  ...lifeSupportExplanationsFR,
  ...advancedIllnessExplanationsFR
];

/**
 * Gets the explanation for a question with the given ID in the specified language
 * Now also attempts to match by question content if ID matching fails
 */
export const getQuestionExplanation = (questionId: string, language: 'en' | 'fr', questionText?: string): string => {
  // Check if this is a life support question ID (21-32)
  if (questionId && !isNaN(parseInt(questionId))) {
    const idNumber = parseInt(questionId);
    if (idNumber >= 21 && idNumber <= 32) {
      // Early return with empty string for life support questions
      return '';
    }
  }
  
  const explanations = language === 'en' ? questionExplanationsEN : questionExplanationsFR;
  
  // Try to find explanation by exact ID match first
  let explanation = explanations.find(exp => exp.id === questionId);
  
  // If no direct match by ID, try to find by text content if question text is provided
  if (!explanation && questionText) {
    // Check if this is a life support question by examining content
    const isLifeSupportQuestion = checkIfLifeSupportQuestion(questionText, language);
    if (isLifeSupportQuestion) {
      return '';
    }
    
    // First try exact match - but only check if the explanation has a question property
    explanation = explanations.find(exp => 
      exp.question && exp.question.trim().toLowerCase() === questionText.trim().toLowerCase()
    );
    
    // If still no match, try partial match (question contains explanation question or vice versa)
    if (!explanation) {
      explanation = explanations.find(exp => 
        exp.question && (
          exp.question.trim().toLowerCase().includes(questionText.trim().toLowerCase()) ||
          questionText.trim().toLowerCase().includes(exp.question.trim().toLowerCase())
        )
      );
    }
  }
  
  // Return empty string if explanation is not found or the explanation text is empty
  return (explanation && explanation.explanation && explanation.explanation.trim() !== '') 
    ? explanation.explanation 
    : '';
};

/**
 * Helper function to check if a question is a life support question based on its content
 */
function checkIfLifeSupportQuestion(questionText: string, language: 'en' | 'fr'): boolean {
  const lifeSupport = language === 'en' ? lifeSupportExplanationsEN : lifeSupportExplanationsFR;
  
  // Check if the question text matches or is contained in any life support question
  return lifeSupport.some(question => 
    question.question.trim().toLowerCase() === questionText.trim().toLowerCase() ||
    question.question.trim().toLowerCase().includes(questionText.trim().toLowerCase()) ||
    questionText.trim().toLowerCase().includes(question.question.trim().toLowerCase())
  );
}

// Export everything for potential direct access
export {
  generalExplanationsEN,
  generalExplanationsFR,
  lifeSupportExplanationsEN,
  lifeSupportExplanationsFR,
  advancedIllnessExplanationsEN,
  advancedIllnessExplanationsFR,
  questionExplanationsEN,
  questionExplanationsFR
};
